/*
  ANIMASI BUNGA PASTEL JATUH
*/
function buatBunga() {
  const bunga = document.createElement("div");
  bunga.classList.add("flower");
  bunga.innerHTML = "❀";
  // Random warna pastel
  const warna = ["#e8c3b9", "#f2dede", "#f9e6e0"];
  bunga.style.color = warna[Math.floor(Math.random() * warna.length)];
  // Posisi X random
  bunga.style.left = Math.random() * 100 + "vw";
  // Ukuran random
  bunga.style.fontSize = (10 + Math.random() * 10) + "px";
  // Durasi jatuh
  const durasi = 6000 + Math.random() * 4000;
  // Animasi CSS
  bunga.animate(
    [
      { transform: "translateY(0px) rotate(0deg)", opacity: 1 },
      { transform: "translateY(100vh) rotate(360deg)", opacity: 0.8 }
    ],
    { duration: durasi, easing: "linear" }
  ).onfinish = () => bunga.remove();
  document.body.appendChild(bunga);
}
// Setiap 700ms buat bunga baru
setInterval(buatBunga, 700);
