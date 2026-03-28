async function loadGiftCards() {
  const res = await fetch('assets/data/gift.json');
  const data = await res.json();
  const track = document.getElementById('giftTrack');
  // Append data 2x untuk seamless loop
  const doubleData = [...data, ...data];
  doubleData.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.innerHTML = `
      <img src="${item.logo}" class="gift-logo">
      <div class="gift-info">
        <h4>${item.bank}</h4>
        <p>${item.number}</p>
        <small>${item.owner}</small>
      </div>
    `;
    track.appendChild(card);
  });
}
// play/pause
document.getElementById('giftToggle').addEventListener('click', () => {
  const track = document.getElementById('giftTrack');
  const btn = document.getElementById('giftToggle');
  const paused = track.classList.toggle('gift-paused');
  btn.textContent = paused ? 'Lanjutkan' : 'Jeda';
});
document.addEventListener('DOMContentLoaded', loadGiftCards);
