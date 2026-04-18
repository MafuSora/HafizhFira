import time
import os
import csv
import re
import unicodedata
from datetime import datetime

# Selenium Imports
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Webdriver Manager (Untuk mengatasi crash driver)
from webdriver_manager.chrome import ChromeDriverManager

# Google Sheets Imports
import gspread
from oauth2client.service_account import ServiceAccountCredentials

import os # Pastikan import os ada di paling atas

class WhatsAppBot:
    def __init__(self):
        """Initialize the WhatsApp bot with Chrome driver"""
        chrome_options = Options()
        
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        
        # ✅ Pakai Absolute Path (Lokasi penuh) agar Windows mengizinkan
        current_dir = os.getcwd() # Ambil folder tempat script berada
        profile_path = os.path.join(current_dir, "User_Data")
        
        print(f"📁 Profile path: {profile_path}")
        
        # Baris ini yang dimodifikasi
        chrome_options.add_argument(f"--user-data-dir={profile_path}")
        chrome_options.add_argument("--profile-directory=Default")
        
        try:
            self.driver = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()), 
                options=chrome_options
            )
            print("✅ Chrome berhasil dimulai dengan Profile.")
        except Exception as e:
            print(f"❌ Gagal memulai Chrome: {e}")
            # Fallback: Coba matikan profile jika masih gagal
            print("⚠️ Mencoba restart tanpa profile...")
            chrome_options.arguments.remove(f"--user-data-dir={profile_path}")
            chrome_options.arguments.remove("--profile-directory=Default")
            self.driver = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()), 
                options=chrome_options
            )

        self.wait = WebDriverWait(self.driver, 30)
    
    def open_whatsapp(self):
        """Open WhatsApp Web and wait for QR scan"""
        print("Opening WhatsApp Web...")
        self.driver.get("https://web.whatsapp.com")
        print("Please scan the QR code if prompted...")
        
        # Wait for the main page to load
        selectors = [
            '//div[@contenteditable="true"][@data-tab="3"]',  # Search box
            '//div[@data-testid="chat-list"]',  # Chat list
            '//div[contains(@class, "two")]',  # Main layout
            '//span[contains(text(), "WhatsApp")]'  # WhatsApp text
        ]
        
        loaded = False
        for selector in selectors:
            try:
                self.wait.until(EC.presence_of_element_located((By.XPATH, selector)))
                print("WhatsApp Web loaded successfully!")
                loaded = True
                break
            except:
                continue
        
        if not loaded:
            print("⚠️ Waiting for WhatsApp to load... Make sure you scan the QR code.")
            time.sleep(15)
            try:
                self.wait.until(EC.presence_of_element_located((By.XPATH, '//div[@data-testid="chat-list"]')))
                print("WhatsApp Web loaded successfully!")
            except:
                print("❌ WhatsApp Web failed to load properly.")
    
    def sanitize_message(self, message):
        """Sanitize message to remove characters that ChromeDriver can't handle"""
        try:
            sanitized = ''.join(char for char in message if ord(char) <= 0xFFFF)
            sanitized = unicodedata.normalize('NFKC', sanitized)
            sanitized = re.sub(r'[^\x00-\x7F\u0080-\uFFFF]', '', sanitized)
            return sanitized
        except Exception as e:
            print(f"⚠️ Warning: Error sanitizing message: {e}")
            return ''.join(char for char in message if ord(char) < 128)
    
    def send_message(self, phone_number, message):
        """Send a message to a phone number"""
        try:
            sanitized_message = self.sanitize_message(message)
            url = f"https://web.whatsapp.com/send?phone={phone_number}"
            self.driver.get(url)
            print(f"Opening chat with {phone_number}...")
            
            # Wait for chat
            print("🔄 Waiting for chat to load completely...")
            time.sleep(8)
            
            # Check URL valid
            if "web.whatsapp.com" not in self.driver.current_url:
                print(f"❌ Invalid URL redirect")
                return False
            
            # Find Message Box
            message_box = None
            selectors = [
                '//div[@contenteditable="true"][@data-tab="10"]',
                '//div[contains(@class, "selectable-text")][@contenteditable="true"][@data-tab="10"]',
                '//div[@data-testid="conversation-compose-box-input"]',
                '//div[contains(@aria-label, "Type a message")][@contenteditable="true"]',
                '//div[@title="Type a message"][@contenteditable="true"]',
            ]
            
            for attempt in range(5):
                for selector in selectors:
                    try:
                        elements = self.driver.find_elements(By.XPATH, selector)
                        if elements:
                            element = elements[0]
                            data_tab = element.get_attribute('data-tab')
                            if data_tab == '3': continue # Skip search box
                            
                            if element.is_displayed() and element.is_enabled():
                                message_box = element
                                break
                    except:
                        continue
                
                if message_box is not None: break
                time.sleep(4)
            
            if message_box is None:
                print(f"❌ Could not find message input box for {phone_number}")
                return False
            
            time.sleep(2)
            message_box.click()
            time.sleep(1)
            
            # Send Message
            lines = sanitized_message.split('\n')
            for i, line in enumerate(lines):
                if line.strip():
                    message_box.send_keys(line)
                if i < len(lines) - 1:
                    message_box.send_keys(Keys.SHIFT + Keys.ENTER)
            
            message_box.send_keys(Keys.ENTER)
            print(f"✅ Message sent to {phone_number}!")
            time.sleep(3)
            return True
            
        except Exception as e:
            print(f"❌ Error sending message to {phone_number}: {str(e)}")
            return False
    
    def read_csv_file(self, csv_file_path):
        """Read contacts from a CSV file"""
        try:
            data = []
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)
                for row in csv_reader:
                    data.append(row)
            print(f"Successfully read {len(data)} rows from CSV file")
            return data
        except Exception as e:
            print(f"Error reading CSV file: {e}")
            return None
    
    def read_google_sheet(self, sheet_id, credentials_file):
        """
        Read data from Google Sheet
        sheet_id: Your Google Sheet ID (from the URL)
        credentials_file: Path to your service account JSON file
        """
        try:
            scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
            
            creds = ServiceAccountCredentials.from_json_keyfile_name(credentials_file, scope)
            client = gspread.authorize(creds)
            
            # ✅ GANTI BAGIAN INI:
            # Secara default .sheet1 membaca tab paling kiri.
            # Kita ubah menjadi .worksheet("send_wa_auto")
            sheet = client.open_by_key(sheet_id).worksheet("send_wa_auto")
            
            # Get all records
            data = sheet.get_all_records()
            print(f"Successfully read {len(data)} rows from Google Sheet (Tab: send_wa_auto)")
            return data
            
        except Exception as e:
            print(f"❌ Error reading Google Sheet: {e}")
            return None
    
    def format_message_with_variables(self, message, name=None, phone=None):
        """Format message template with dynamic variables"""
        try:
            now = datetime.now()
            formatted_message = message
            
            if name:
                formatted_message = formatted_message.replace('{name}', str(name))
                formatted_message = formatted_message.replace('{Name}', str(name))
                formatted_message = formatted_message.replace('{NAME}', str(name).upper())
            
            formatted_message = formatted_message.replace('{time}', now.strftime('%H:%M'))
            formatted_message = formatted_message.replace('{date}', now.strftime('%B %d, %Y'))
            formatted_message = formatted_message.replace('{datetime}', now.strftime('%B %d, %Y at %H:%M'))
            formatted_message = formatted_message.replace('{day}', now.strftime('%A'))
            formatted_message = formatted_message.replace('{month}', now.strftime('%B'))
            formatted_message = formatted_message.replace('{year}', now.strftime('%Y'))
            
            if phone:
                formatted_message = formatted_message.replace('{phone}', str(phone))
            
            return formatted_message
        except Exception as e:
            print(f"Error formatting message: {e}")
            return message

    def close(self):
        """Close the browser"""
        print("Closing browser...")
        self.driver.quit()


# ===== USAGE EXAMPLE =====
if __name__ == "__main__":
    # Initialize bot
    bot = WhatsAppBot()
    
    try:
        # Step 1: Open WhatsApp Web
        bot.open_whatsapp()
        
        # Step 2: Settings
        # Ganti Sheet ID sesuai Google Sheet Anda
        sheet_id = "185GcbyHIH45AwNEAzW50TpAw4vjxy5-E8NbtMIN6n0c"
        credentials_file = "credentials.json"
        
        # Pesan Fallback jika kolom Message di spreadsheet kosong
        default_message = """Halo {name},
Ini adalah pesan default karena kolom Message di Spreadsheet Anda kosong.
Terima kasih."""
        
        # Step 3: Read Contacts
        data = None
        
        if os.path.exists(credentials_file):
            print("📄 Reading contacts from Google Sheet...")
            data = bot.read_google_sheet(sheet_id, credentials_file)
        else:
            print("⚠️ No credentials.json found for Google Sheets. Trying CSV...")
            csv_file = "contacts.csv"
            if os.path.exists(csv_file):
                data = bot.read_csv_file(csv_file)
        
        if data is None:
            print("❌ No contacts found.")
            print("Pastikan ada file 'contacts.csv' atau Google Sheet sudah di-share.")
            exit()

        # Step 4: Kirim Pesan (Logic Baru: Pesan Per Baris)
        print(f"📨 Found {len(data)} contacts. Starting to send messages...")
        successful_sends = 0
        
        for i, row in enumerate(data, 1):
            phone = str(row.get('Phone', '')).strip()
            name = str(row.get('Name', '')).strip()
            
            # Cek data valid
            if phone and name and phone != 'nan':
                print(f"\n📱 [{i}/{len(data)}] Sending to {name} ({phone})")
                
                # ✅ LOGIKA BARU: Ambil pesan dari kolom 'Message' di Spreadsheet
                raw_message = row.get('Message')
                
                # Jika kolom Message tidak ada atau kosong, pakai default_message
                if not raw_message or str(raw_message).strip() == '':
                    print("⚠️ Kolom 'Message' kosong, menggunakan pesan default.")
                    raw_message = default_message
                
                # Sanitasi (Bersihkan karakter aneh)
                sanitized_msg = bot.sanitize_message(str(raw_message))
                
                # Format variable (Masih support {name}, {time} meskipun di Spreadsheet)
                final_msg = bot.format_message_with_variables(sanitized_msg, name=name, phone=phone)
                
                # Kirim
                success = bot.send_message(phone, final_msg)
                if success:
                    successful_sends += 1
                    print(f"✅ Success: {name}")
                else:
                    print(f"❌ Failed: {name}")
                
                # Delay penting agar tidak di-ban
                time.sleep(5) 
            else:
                print(f"⚠️ Skipping row {i}: Missing phone or name data")
        
        print(f"\n📊 Summary: {successful_sends}/{len(data)} messages sent successfully")
        print("\n✅ All tasks finished!")
        
        time.sleep(5)
        
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close browser
        bot.close()