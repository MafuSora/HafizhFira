/*
  MUSIC CONTROLLER
  - Play setelah user klik "Buka Undangan"
  - Floating button untuk toggle play/pause
*/
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
let musicPlaying = false;
// Klik tombol musik
musicBtn.addEventListener("click", () => {
  if (musicPlaying) {
    bgm.pause();
    musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
  } else {
    bgm.play();
    musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
  musicPlaying = !musicPlaying;
});
// Play setelah user buka undangan
document.addEventListener("bukaUndangan", () => {
  bgm.play();
  musicPlaying = true;
  musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});
