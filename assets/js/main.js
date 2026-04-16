/*
  MAIN.JS — FUNGSI UTAMA HALAMAN
*/
/* ===============================
   1. COUNTDOWN ACARA
=============================== */
(function () {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;
  const eventDate = new Date('May 23, 2026 10:00:00').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventDate - now;
    if (diff <= 0) {
      countdownEl.textContent = 'Acara Sedang Berlangsung';
      return;
    }
    const hari = Math.floor(diff / (1000 * 60 * 60 * 24));
    const jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((diff % (1000 * 60)) / 1000);
    countdownEl.textContent = `${hari} Hari : ${jam} Jam : ${menit} Menit : ${detik} Detik`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
/* ===============================
   2. FADE-IN ON SCROLL
=============================== */
(function () {
  const sections = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.2 },
  );
  sections.forEach((sec) => observer.observe(sec));
})();
/* ===============================
   3. GIFT RUNNING TEXT - TOGGLE
=============================== */
(function () {
  const giftBtn = document.getElementById('giftToggle');
  const giftRun = document.getElementById('giftRunning');
  if (!giftBtn || !giftRun) return;
  let paused = false;
  giftBtn.addEventListener('click', () => {
    paused = !paused;
    giftRun.classList.toggle('gift-paused', paused);
    giftBtn.textContent = paused ? 'Lanjutkan Animasi' : 'Jeda Animasi';
  });
})();
/* ===============================
   4. COVER OPENING → BUKA UNDANGAN
=============================== */
(function () {
  const cover = document.getElementById('coverUndangan');
  const btnOpen = document.getElementById('btnOpen');
  btnOpen.addEventListener('click', () => {
    cover.classList.add('cover-hidden');
    // Dispatch event agar music.js bisa play
    setTimeout(() => {
      document.dispatchEvent(new Event('bukaUndangan'));
    }, 600);
  });
})();
