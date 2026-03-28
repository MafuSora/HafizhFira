/*
   SLUG DUAL MODE
   Mendukung:
   1) /1/hafizh
   2) /index.html/1/hafizh
   3) ?tipe=1&nama=hafizh
*/
(function () {
  let tipe = 0;
  let nama = 'Tamu Undangan';
  const path = window.location.pathname.split('/').filter(Boolean);
  // MODE 1: /tipe/nama
  if (path.length >= 2 && !path[1].includes('.html')) {
    tipe = Number(path[0]);
    nama = decodeURIComponent(path[1]);
  }
  // MODE 2: /index.html/tipe/nama
  if (path.length >= 3 && path[1].includes('.html')) {
    tipe = Number(path[1]);
    nama = decodeURIComponent(path[2]);
  }
  // MODE 3: query param
  const url = new URL(window.location.href);
  if (url.searchParams.has('tipe')) {
    tipe = Number(url.searchParams.get('tipe'));
  }
  if (url.searchParams.has('nama')) {
    nama = url.searchParams.get('nama');
  }
  // Apply to UI
  let jam = '';
  if (tipe === 1) jam = '10:00 - 12:00';
  else if (tipe === 2) jam = '12:00 - 15:00';
  else if (tipe === 3) jam = '10:00 - 15:00';
  else jam = '10:00 - Selesai';
  /* Apply nama ke SEMUA elemen .namaTamu */
  document.querySelectorAll('#namaTamu').forEach((el) => {
    el.textContent = nama;
  });
  /* Apply ke input komentar */
  const namaKomentar = document.querySelector('#komentarNama');
  if (namaKomentar) namaKomentar.value = nama;
  /* Apply jam */
  const waktuTamu = document.querySelectorAll('#waktuTamu');
  waktuTamu.forEach((el) => {
    el.textContent = jam;
  });
})();
