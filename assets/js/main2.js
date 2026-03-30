/* ========================================
   🎯 MAIN.JS - ALL IN ONE
   Gabungan semua fungsi dalam 1 file
======================================== */
/* ===============================
   1. COUNTDOWN TIMER
=============================== */
// (function initCountdown() {
//   const countdownEl = document.getElementById('countdown');
//   if (!countdownEl) return;
//   const eventDate = new Date('May 23, 2026 10:00:00').getTime();
//   function updateCountdown() {
//     const now = new Date().getTime();
//     const diff = eventDate - now;
//     if (diff <= 0) {
//       countdownEl.innerHTML =
//         '<span style="color: var(--pink-accent);">🎉 Acara Sedang Berlangsung 🎉</span>';
//       return;
//     }
//     const hari = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const menit = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     const detik = Math.floor((diff % (1000 * 60)) / 1000);
//     countdownEl.innerHTML = `
//       <span style="color: var(--mocha-dark);">${hari}</span> Hari :
//       <span style="color: var(--mocha-dark);">${jam}</span> Jam :
//       <span style="color: var(--mocha-dark);">${menit}</span> Menit :
//       <span style="color: var(--pink-accent);">${detik}</span> Detik
//     `;
//   }
//   updateCountdown();
//   setInterval(updateCountdown, 1000);
// })();
/* ===============================
   2. SLUG HANDLER (Dual Mode)
=============================== */
(function initSlug() {
  let tipe = 0;
  let nama = 'Tamu Undangan';
  const path = window.location.pathname.split('/').filter(Boolean);
  // MODE 1: /tipe/nama
  if (path.length >= 2 && !path[0].includes('.html')) {
    tipe = Number(path[0]);
    nama = decodeURIComponent(path[1]);
  }
  // MODE 2: /index.html/tipe/nama
  if (path.length >= 3 && path[0].includes('.html')) {
    tipe = Number(path[1]);
    nama = decodeURIComponent(path[2]);
  }
  // MODE 3: Query param (?tipe=1&nama=hafizh)
  const url = new URL(window.location.href);
  if (url.searchParams.has('tipe')) {
    tipe = Number(url.searchParams.get('tipe'));
  }
  if (url.searchParams.has('nama')) {
    nama = url.searchParams.get('nama');
  }
  // Tentukan jam berdasarkan tipe
  let jam = '';
  if (tipe === 1) jam = '10:00 - 12:00 WIB';
  else if (tipe === 2) jam = '12:00 - 15:00 WIB';
  else if (tipe === 3) jam = '10:00 - 15:00 WIB';
  else jam = '10:00 WIB - Selesai';
  // Apply ke semua element dengan id #namaTamu
  document.querySelectorAll('#namaTamu').forEach((el) => {
    el.textContent = nama;
  });
  // Apply ke input komentar (readonly)
  const namaKomentar = document.querySelector('#komentarNama');
  if (namaKomentar) namaKomentar.value = nama;
  // Apply jam
  document.querySelectorAll('#waktuTamu').forEach((el) => {
    el.textContent = jam;
  });
})();
/* ===============================
   3. ENVELOPE INTERACTIVE ANIMATION
=============================== */
(function initEnvelope() {
  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelopeBox = document.getElementById('envelopeBox');
  const envelopeCard = document.getElementById('envelopeCard');
  const btnOpen = document.getElementById('btnOpenEnvelope');
  const flap = document.querySelector('.env-flap');
  if (!envelopeScreen || !btnOpen) return;
  // State
  let isOpening = false;
  // Button Click Handler
  btnOpen.addEventListener('click', function () {
    if (isOpening) return;
    isOpening = true;
    // Disable button
    this.disabled = true;
    this.style.opacity = '0.6';
    // Step 1: Open flap (1s)
    flap.classList.add('flap-open');
    // Step 2: Card slides out (after 0.5s)
    setTimeout(() => {
      envelopeCard.classList.add('card-out');
    }, 500);
    // Step 3: Shake envelope
    setTimeout(() => {
      envelopeBox.style.animation = 'envelopeShake 0.5s ease';
    }, 1500);
    // Step 4: Zoom and fade entire screen (after 2.5s)
    setTimeout(() => {
      envelopeScreen.style.transform = 'scale(1.2)';
      envelopeScreen.style.opacity = '0';
    }, 2500);
    // Step 5: Hide completely and trigger event (after 3.5s)
    setTimeout(() => {
      envelopeScreen.classList.add('envelope-hide');
      document.dispatchEvent(new Event('bukaUndangan'));
    }, 3500);
  });
  // Hover effect on envelope
  envelopeBox.addEventListener('mouseenter', () => {
    if (!isOpening) {
      envelopeBox.style.transform = 'scale(1.05) translateY(-10px)';
    }
  });
  envelopeBox.addEventListener('mouseleave', () => {
    if (!isOpening) {
      envelopeBox.style.transform = 'scale(1) translateY(0)';
    }
  });
  // Mobile Touch Effect
  let touchStartY = 0;
  envelopeBox.addEventListener('touchstart', (e) => {
    if (!isOpening) {
      touchStartY = e.touches[0].clientY;
      envelopeBox.style.transform = 'scale(1.05)';
    }
  });
  envelopeBox.addEventListener('touchmove', (e) => {
    if (!isOpening) {
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      if (diff > 0 && diff < 50) {
        // Pull up effect
        envelopeBox.style.transform = `scale(1.05) translateY(-${diff}px)`;
      }
    }
  });
  envelopeBox.addEventListener('touchend', () => {
    if (!isOpening) {
      envelopeBox.style.transform = 'scale(1) translateY(0)';
    }
  });
  // Keyboard Support (Press Enter or Space)
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isOpening) {
      e.preventDefault();
      btnOpen.click();
    }
  });
})();

// Tambahkan di dalam btnOpen.addEventListener('click')
// Setelah line: this.style.opacity = '0.6';
// Create confetti
function createConfetti() {
  const colors = ['#FFB6C1', '#FFC0CB', '#F5DEB3', '#C8AD7F'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }, i * 50);
  }
}
// Call confetti
setTimeout(createConfetti, 1000);
/* ===============================
   4. MUSIC CONTROLLER
=============================== */
(function initMusic() {
  const bgm = document.getElementById('bgm');
  const musicBtn = document.getElementById('musicBtn');
  if (!bgm || !musicBtn) return;
  let musicPlaying = false;
  // Toggle music on button click
  musicBtn.addEventListener('click', () => {
    if (musicPlaying) {
      bgm.pause();
      musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
      musicBtn.classList.remove('playing');
    } else {
      bgm.play().catch((err) => console.log('Music play blocked:', err));
      musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      musicBtn.classList.add('playing');
    }
    musicPlaying = !musicPlaying;
  });
  // Auto play after envelope opens
  document.addEventListener('bukaUndangan', () => {
    bgm.play().catch((err) => console.log('Autoplay blocked:', err));
    musicPlaying = true;
    musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    musicBtn.classList.add('playing');
  });
})();
/* ===============================
   5. SIDEBAR NAVIGATION - DYNAMIC BUTTON POSITION
=============================== */
(function initSidebar() {
  const sidebar = document.getElementById('sidebarNav');
  const toggleBtn = document.getElementById('sidebarToggle');
  const items = document.querySelectorAll('.sidebar-item');
  if (!sidebar || !toggleBtn) return;
  let isSidebarVisible = true;
  // ✅ Show sidebar & button after envelope
  document.addEventListener('bukaUndangan', () => {
    setTimeout(() => {
      sidebar.classList.add('show');
      toggleBtn.classList.add('show');
      toggleBtn.classList.add('sidebar-visible'); // ✅ Button geser ke kiri
    }, 700);
  });
  // ✅ TOGGLE FUNCTIONALITY
  toggleBtn.addEventListener('click', () => {
    isSidebarVisible = !isSidebarVisible;
    if (isSidebarVisible) {
      // SHOW sidebar
      sidebar.classList.remove('sidebar-hidden');
      toggleBtn.classList.remove('sidebar-closed');
      toggleBtn.classList.add('sidebar-visible'); // ✅ Button geser ke kiri
      console.log('✅ Sidebar shown');
    } else {
      // HIDE sidebar
      sidebar.classList.add('sidebar-hidden');
      toggleBtn.classList.add('sidebar-closed');
      toggleBtn.classList.remove('sidebar-visible'); // ✅ Button balik ke kanan
      console.log('❌ Sidebar hidden');
    }
  });
  // ✅ Scroll to section
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = item.dataset.target;
      const target = document.querySelector(targetSelector);
      const container = document.getElementById('mainContainer');
      if (target && container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const targetPosition = scrollTop + (targetRect.top - containerRect.top);
        container.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
  // ✅ Highlight active section
  const container = document.getElementById('mainContainer');
  if (container) {
    let scrollTimeout;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        document.querySelectorAll('.snap-section').forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const sectionTop = rect.top - containerRect.top;
          const sectionMiddle = sectionTop + rect.height / 2;
          if (sectionMiddle >= 0 && sectionMiddle <= containerHeight) {
            items.forEach((item) => item.classList.remove('active'));
            if (items[index]) {
              items[index].classList.add('active');
            }
          }
        });
      }, 100);
    });
  }
})();
/* ===============================
   6. FADE-IN SECTIONS ON SCROLL
=============================== */
(function initFadeSection() {
  const sections = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 },
  );
  sections.forEach((sec) => observer.observe(sec));
})();
/* ===============================
   7. SNAP SCROLL AUTO CORRECTION
=============================== */
// (function initSnapScroll() {
//   const container = document.getElementById('mainContainer');
//   if (!container) return;
//   let isSnapping = false;
//   function snapToCenter() {
//     if (isSnapping) return;
//     isSnapping = true;
//     setTimeout(() => {
//       const sections = document.querySelectorAll('.snap-section');
//       let nearest = null;
//       let minDistance = Infinity;
//       const middle = window.innerHeight / 2;
//       sections.forEach((sec) => {
//         const rect = sec.getBoundingClientRect();
//         const secMiddle = rect.top + rect.height / 2;
//         const dist = Math.abs(secMiddle - middle);
//         if (dist < minDistance) {
//           minDistance = dist;
//           nearest = sec;
//         }
//       });
//       if (nearest) {
//         nearest.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//       setTimeout(() => {
//         isSnapping = false;
//       }, 400);
//     }, 150);
//   }
//   container.addEventListener('scroll', () => {
//     clearTimeout(container.snapTimeout);
//     container.snapTimeout = setTimeout(snapToCenter, 120);
//   });
// })();
/* ===============================
   8. FLOATING FLOWERS ANIMATION
=============================== */
(function initBunga() {
  function buatBunga() {
    const bunga = document.createElement('div');
    bunga.classList.add('flower');
    bunga.innerHTML = '❀';
    // Random pastel colors
    const warna = ['#FFE4E1', '#FFC0CB', '#F5DEB3', '#E8C3B9'];
    bunga.style.color = warna[Math.floor(Math.random() * warna.length)];
    // Random X position
    bunga.style.left = Math.random() * 100 + 'vw';
    // Random size
    bunga.style.fontSize = 12 + Math.random() * 12 + 'px';
    // Fall duration
    const durasi = 6000 + Math.random() * 4000;
    // Animate
    bunga.animate(
      [
        { transform: 'translateY(-20px) rotate(0deg)', opacity: 1 },
        { transform: 'translateY(100vh) rotate(360deg)', opacity: 0.7 },
      ],
      { duration: durasi, easing: 'linear' },
    ).onfinish = () => bunga.remove();
    document.body.appendChild(bunga);
  }
  // Create flower every 700ms
  setInterval(buatBunga, 700);
})();
/* ===============================
   9. GALLERY MASONRY WITH AUTO REFRESH
=============================== */
(function initGallery() {
  let galleryImages = [];
  const gal = document.getElementById('galleryMasonry');
  if (!gal) return;
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function renderGallery(images) {
    gal.innerHTML = '';
    images.forEach((img) => {
      const a = document.createElement('a');
      a.href = img.full;
      a.className = 'masonry-item glightbox-item';
      const im = document.createElement('img');
      im.dataset.src = img.thumb;
      im.alt = img.caption || 'Gallery Image';
      a.appendChild(im);
      gal.appendChild(a);
    });
    // Lazy load images
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const im = e.target;
            im.src = im.dataset.src;
            im.onload = () => im.classList.add('loaded');
            observer.unobserve(im);
          }
        });
      },
      { root: document.querySelector('.gallery-scroll'), rootMargin: '150px' },
    );
    gal.querySelectorAll('img').forEach((img) => observer.observe(img));
    // Init Lightbox
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox-item' });
    }
  }
  function shuffleFade() {
    // Fade OUT
    gal.classList.add('fade-out');
    gal.classList.remove('fade-in');
    setTimeout(() => {
      // Shuffle and re-render
      renderGallery(shuffleArray([...galleryImages]));
      // Fade IN
      gal.classList.remove('fade-out');
      gal.classList.add('fade-in');
    }, 1200);
  }
  async function loadGallery() {
    try {
      const res = await fetch('assets/data/gallery.json');
      galleryImages = await res.json();
      renderGallery(shuffleArray([...galleryImages]));
      gal.classList.add('fade-in');
      // Auto refresh every 7 seconds
      setInterval(shuffleFade, 7000);
    } catch (err) {
      console.log('Gallery load error:', err);
      gal.innerHTML =
        '<p style="text-align:center;color:var(--text-light);">Galeri tidak tersedia</p>';
    }
  }
  document.addEventListener('DOMContentLoaded', loadGallery);
})();
/* ===============================
   10. GIFT CAROUSEL
=============================== */
(function initGift() {
  const track = document.getElementById('giftTrack');
  const toggleBtn = document.getElementById('giftToggle');
  if (!track || !toggleBtn) return;
  async function loadGiftCards() {
    try {
      const res = await fetch('assets/data/gift.json');
      const data = await res.json();
      // Double data for seamless loop
      const doubleData = [...data, ...data];
      doubleData.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        card.innerHTML = `
          <img src="${item.logo}" class="gift-logo" alt="${item.bank}">
          <div class="gift-info">
            <h4>${item.bank}</h4>
            <p>${item.number}</p>
            <small>${item.owner}</small>
          </div>
        `;
        track.appendChild(card);
      });
    } catch (err) {
      console.log('Gift load error:', err);
    }
  }
  // Toggle play/pause
  toggleBtn.addEventListener('click', () => {
    const paused = track.classList.toggle('gift-paused');
    toggleBtn.textContent = paused ? 'Lanjutkan' : 'Jeda';
  });
  document.addEventListener('DOMContentLoaded', loadGiftCards);
})();
/* ===============================
   11. LIVE CHAT STREAM + KEHADIRAN
=============================== */
(function initKomentar() {
  const KOMENTAR_API =
    'https://script.google.com/macros/s/AKfycbwqvZBQhgeyikg3u0GIyOXIQqQRhcHPepYiZuKud2hRBvRDU6RkVbT4UWWkrD5iUAArKQ/exec'; // ✅ UPDATE INI
  const liveList = document.getElementById('liveKomentarList');
  const form = document.getElementById('formKomentar');
  const statusEl = document.getElementById('komentarStatus');
  const wishesCountEl = document.getElementById('wishesCount');
  if (!liveList) {
    console.warn('❌ liveKomentarList not found');
    return;
  }
  let chatData = [];
  let chatIndex = 0;
  // Fetch comments from Google Sheet
  async function fetchChats() {
    try {
      console.log('📡 Fetching comments...');
      const res = await fetch(KOMENTAR_API);
      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }
      const data = await res.json();
      console.log('✅ Fetched ' + data.length + ' comments');
      if (data.length > 0) {
        console.log('Sample data:', data[0]);
      }
      chatData = data.reverse();
      chatIndex = 0;
      if (wishesCountEl) {
        wishesCountEl.textContent = data.length;
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  }
  // Add one chat to stream
  // Add one chat to stream
  function addOneChat() {
    if (chatData.length === 0) {
      return;
    }
    const item = chatData[chatIndex];
    const kehadiran = item.kehadiran || 'belum-tahu';
    console.log('💬 Adding: ' + item.nama + ' | Kehadiran: ' + kehadiran);
    const div = document.createElement('div');
    div.className = 'chat-item';
    const avatarUrl =
      'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(item.nama) +
      '&background=FFB6C1&color=fff&bold=true';
    // ✅ BADGE ICON ONLY
    let badgeIcon = '❓';
    if (kehadiran === 'hadir') {
      badgeIcon = '✅';
    } else if (kehadiran === 'tidak-hadir') {
      badgeIcon = '❌';
    }
    // ✅ BADGE DI SAMPING NAMA
    div.innerHTML =
      '<img src="' +
      avatarUrl +
      '" class="chat-avatar" alt="' +
      item.nama +
      '">' +
      '<div class="chat-bubble">' +
      '<div class="chat-name-wrapper">' +
      '<span class="chat-name">' +
      item.nama +
      '</span>' +
      '<span class="attendance-icon">' +
      badgeIcon +
      '</span>' +
      '</div>' +
      '<div class="chat-message">' +
      item.pesan +
      '</div>' +
      '</div>';
    liveList.appendChild(div);
    const wrapper = liveList.parentElement;
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
    chatIndex++;
    if (chatIndex >= chatData.length) {
      chatIndex = 0;
    }
  }
  // Start live stream
  async function startLiveStream() {
    await fetchChats();
    if (chatData.length > 0) {
      for (let i = 0; i < Math.min(3, chatData.length); i++) {
        setTimeout(function () {
          addOneChat();
        }, i * 800);
      }
    }
    setInterval(function () {
      if (chatData.length > 0) {
        addOneChat();
      }
    }, 3000);
  }
  // Submit new comment
  // Submit new comment
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const namaInput = document.getElementById('komentarNama');
      const pesanInput = document.getElementById('komentarPesan');
      // ✅ AMBIL dari RADIO BUTTON (bukan dropdown)
      const kehadiranRadio = document.querySelector(
        'input[name="kehadiran"]:checked',
      );
      if (!namaInput || !pesanInput) {
        console.error('❌ Form elements not found!');
        return;
      }
      const nama = namaInput.value.trim();
      const pesan = pesanInput.value.trim();
      const kehadiran = kehadiranRadio ? kehadiranRadio.value : 'belum-tahu'; // ✅ DARI RADIO
      console.log('📤 SENDING DATA:', {
        nama: nama,
        pesan: pesan,
        kehadiran: kehadiran,
      });
      if (!pesan) {
        statusEl.textContent = '⚠️ Ucapan tidak boleh kosong';
        statusEl.className = 'form-status show error';
        return;
      }
      try {
        statusEl.textContent = '⏳ Mengirim ucapan...';
        statusEl.className = 'form-status show';
        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('pesan', pesan);
        formData.append('kehadiran', kehadiran);
        console.log('📦 FormData:', {
          nama: formData.get('nama'),
          pesan: formData.get('pesan'),
          kehadiran: formData.get('kehadiran'),
        });
        const res = await fetch(KOMENTAR_API, {
          method: 'POST',
          body: formData,
        });
        console.log('📥 Response status:', res.status);
        if (!res.ok) {
          throw new Error('HTTP ' + res.status);
        }
        const result = await res.json();
        console.log('✅ RESULT:', result);
        statusEl.textContent = '✅ Ucapan terkirim! Terima kasih 💕';
        statusEl.className = 'form-status show success';
        pesanInput.value = '';
        // ✅ RESET RADIO ke 'hadir'
        const radioHadir = document.querySelector(
          'input[name="kehadiran"][value="hadir"]',
        );
        if (radioHadir) {
          radioHadir.checked = true;
        }
        setTimeout(async function () {
          await fetchChats();
          statusEl.className = 'form-status';
        }, 2000);
      } catch (err) {
        console.error('❌ SUBMIT ERROR:', err);
        statusEl.textContent = '❌ Gagal: ' + err.message;
        statusEl.className = 'form-status show error';
      }
    });
  }
  // Initial load
  document.addEventListener('DOMContentLoaded', startLiveStream);
  document.addEventListener('bukaUndangan', function () {
    setTimeout(startLiveStream, 2000);
  });
})();
/* ===============================
   12. SMOOTH SCROLL FOR LINKS
=============================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    });
  });
})();
/* ===============================
   13. LAZY LOAD IMAGES
=============================== */
(function initLazyLoad() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
})();
/* ===============================
   14. PREVENT RIGHT CLICK (Optional)
=============================== */
// Uncomment jika ingin disable right-click pada gambar
/*
(function preventRightClick() {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      alert('📸 Mohon maaf, gambar tidak dapat diunduh');
    }
  });
})();
*/
/* ===============================
   15. LOADING PERFORMANCE
=============================== */
(function initPerformance() {
  // Preload critical images
  window.addEventListener('load', () => {
    const preloadImages = document.querySelectorAll('[data-preload]');
    preloadImages.forEach((img) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src || img.dataset.src;
      document.head.appendChild(link);
    });
  });
})();
/* ===============================
   16. CONSOLE LOG ARTISTIC
=============================== */
(function artisticConsole() {
  console.log(
    '%c💕 Hafizh & Fira Wedding 💕',
    'font-size: 24px; font-weight: bold; color: #FFB6C1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);',
  );
  console.log(
    '%cDesigned with ❤️ by MafuSora',
    'font-size: 14px; color: #8B6F47; font-style: italic;',
  );
  console.log(
    '%cMocha Latte + Romantic Pink Theme',
    'font-size: 12px; color: #C8AD7F;',
  );
})();
/* ===============================
   17. FORM VALIDATION
=============================== */
(function initFormValidation() {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach((input) => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.style.borderColor = 'var(--pink-accent)';
        input.style.boxShadow = '0 0 0 3px rgba(255, 182, 193, 0.3)';
      });
      input.addEventListener('input', () => {
        if (input.validity.valid) {
          input.style.borderColor = 'var(--pink-soft)';
          input.style.boxShadow = 'none';
        }
      });
    });
  });
})();
/* ===============================
   18. DETECT MOBILE/DESKTOP
=============================== */
(function detectDevice() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  if (isMobile) {
    document.body.classList.add('mobile-device');
  } else {
    document.body.classList.add('desktop-device');
  }
})();
/* ===============================
   19. PREVENT ZOOM ON MOBILE (Optional)
=============================== */
// (function preventZoom() {
//   document.addEventListener('gesturestart', function (e) {
//     e.preventDefault();
//   });
//   document.addEventListener(
//     'touchmove',
//     function (e) {
//       if (e.scale !== 1) {
//         e.preventDefault();
//       }
//     },
//     { passive: false },
//   );
// })();
/* ===============================
   20. EASTER EGG - KONAMI CODE
=============================== */
(function konamiCode() {
  const konamiPattern = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  let konamiIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiPattern[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiPattern.length) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        alert('🎉 Secret unlocked! You found the Konami Code! 💕');
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
  // Rainbow animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();
/* ===============================
   🎯 INITIALIZATION MESSAGE
=============================== */
console.log(
  '%c✅ All scripts loaded successfully!',
  'color: #6F4E37; font-weight: bold; padding: 4px;',
);
// Export untuk debugging (optional)
window.WeddingApp = {
  version: '1.0.0',
  theme: 'Mocha Latte + Romantic Pink',
  author: 'MafuSora',
};
/* ===============================
   ⏰ COUNTDOWN TIMER - UPDATED
=============================== */
/* ===============================
   ⏰ COUNTDOWN TIMER - UNIVERSAL VERSION
   Applies to ALL countdown elements on page
=============================== */
(function initCountdown() {
  // ✅ Query ALL countdown elements (bisa multiple)
  const allDays = document.querySelectorAll(
    '[id="days"], [data-countdown="days"]',
  );
  const allHours = document.querySelectorAll(
    '[id="hours"], [data-countdown="hours"]',
  );
  const allMinutes = document.querySelectorAll(
    '[id="minutes"], [data-countdown="minutes"]',
  );
  const allSeconds = document.querySelectorAll(
    '[id="seconds"], [data-countdown="seconds"]',
  );
  // Check if ada countdown elements
  if (allDays.length === 0) {
    console.warn('⚠️ No countdown elements found');
    return;
  }
  // Event date
  const eventDate = new Date('May 23, 2026 10:00:00').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventDate - now;
    // Jika event sudah lewat
    if (diff <= 0) {
      allDays.forEach((el) => (el.textContent = '00'));
      allHours.forEach((el) => (el.textContent = '00'));
      allMinutes.forEach((el) => (el.textContent = '00'));
      allSeconds.forEach((el) => (el.textContent = '00'));
      return;
    }
    // Calculate time
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    // ✅ Update ALL elements
    allDays.forEach((el) => (el.textContent = String(days).padStart(2, '0')));
    allHours.forEach((el) => (el.textContent = String(hours).padStart(2, '0')));
    allMinutes.forEach(
      (el) => (el.textContent = String(minutes).padStart(2, '0')),
    );
    allSeconds.forEach(
      (el) => (el.textContent = String(seconds).padStart(2, '0')),
    );
  }
  // Initial update
  updateCountdown();
  // Update setiap detik
  setInterval(updateCountdown, 1000);
  console.log(`⏰ Countdown initialized for ${allDays.length} instance(s)`);
})();

/* ===============================
   SCROLL INDICATOR
=============================== */
(function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');
  const container = document.getElementById('mainContainer');
  if (!indicator || !container) return;
  // Hide after envelope opens
  document.addEventListener('bukaUndangan', () => {
    setTimeout(() => {
      indicator.style.opacity = '0.6';
    }, 1000);
  });
  // Hide on scroll
  container.addEventListener('scroll', () => {
    if (container.scrollTop > 100) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  });
  // Click to scroll
  indicator.addEventListener('click', () => {
    container.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  });
})();
/* ===============================
   MOBILE SCROLL FIX
=============================== */
// (function fixMobileScroll() {
//   const container = document.getElementById('mainContainer');
//   if (!container) return;
//   // ✅ Force touch scroll
//   let touchStartY = 0;
//   let scrollStartY = 0;
//   container.addEventListener(
//     'touchstart',
//     function (e) {
//       touchStartY = e.touches[0].clientY;
//       scrollStartY = container.scrollTop;
//     },
//     { passive: true },
//   );
//   container.addEventListener(
//     'touchmove',
//     function (e) {
//       const touchY = e.touches[0].clientY;
//       const deltaY = touchStartY - touchY;
//       container.scrollTop = scrollStartY + deltaY;
//     },
//     { passive: true },
//   );
//   console.log('✅ Mobile scroll enabled');
// })();
/* ===============================
   📱 MOBILE OPTIMIZATION
=============================== */
(function optimizeMobile() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  if (isMobile) {
    console.log('📱 Mobile detected - Optimizing...');
    // ✅ Disable floating flowers (heavy animation)
    const flowerInterval = window.setInterval(function () {}, 0);
    const highestId = window.setTimeout(function () {
      for (let i = highestId; i >= 0; i--) {
        window.clearInterval(i);
      }
    }, 0);
    // ✅ Reduce gallery refresh rate
    document.addEventListener('DOMContentLoaded', function () {
      const galleryFade = document.getElementById('galleryMasonry');
      if (galleryFade) {
        // Stop auto shuffle on mobile
        galleryFade.style.transition = 'none';
      }
    });
    // ✅ Simplify animations
    document.body.classList.add('mobile-optimized');
  }
})();
