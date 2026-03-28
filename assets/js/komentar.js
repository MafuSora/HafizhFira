/*
  LIVE CHAT STREAM — masuk satu-satu — looping terus
  Data dari Google Sheet (API kamu)
*/
const KOMENTAR_API =
  'https://script.google.com/macros/s/AKfycbxoEdSOjuTKbPheyAtLX3vshxu_BfqHfTsSkvkMIU4EQX_Zgryee_8KAp1KTPgZdhNeVw/exec';
const liveList = document.getElementById('liveKomentarList');
let chatData = [];
let chatIndex = 0;
/* Ambil komentar dari Sheet */
async function fetchChats() {
  try {
    const res = await fetch(KOMENTAR_API);
    const data = await res.json();
    // Terbaru di belakang → cocok untuk looping
    chatData = data.reverse();
    chatIndex = 0;
  } catch (err) {
    console.log('Gagal fetch komentar');
  }
}
/* Tambahkan satu chat ke list (Live-stream effect) */
function addOneChat() {
  if (chatData.length === 0) return;
  const item = chatData[chatIndex];
  // Create chat bubble
  const div = document.createElement('div');
  div.className = 'chat-item';
  // Avatar generator (random color avatar)
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama)}&background=random`;
  div.innerHTML = `
    <img src="${avatarUrl}" class="chat-avatar">
    <div class="chat-bubble">
      <div class="chat-name">${item.nama}</div>
      <div class="chat-message">${item.pesan}</div>
    </div>
  `;
  liveList.appendChild(div);
  // Auto-scroll down
  liveList.parentElement.scrollTop = liveList.parentElement.scrollHeight;
  // Next chat (loop)
  chatIndex++;
  if (chatIndex >= chatData.length) chatIndex = 0;
}
/* AUTO PLAY CHAT (masuk satu-satu) */
async function startLiveStream() {
  await fetchChats();
  setInterval(() => {
    addOneChat();
  }, 2500); // chat baru tiap 2.5 detik
}
/* INITIAL LOAD */
document.addEventListener('DOMContentLoaded', startLiveStream);
