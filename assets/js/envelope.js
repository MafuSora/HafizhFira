/*
  ENVELOPE OPENING ANIMATION (Model C)
*/
const envelopeScreen = document.getElementById('envelopeScreen');
const envelope = document.querySelector('.envelope-container');
// Setelah animasi card keluar → fade-out amplop
setTimeout(() => {
  envelopeScreen.classList.add('envelope-hide');
  document.dispatchEvent(new Event('bukaUndangan'));
}, 3800);
