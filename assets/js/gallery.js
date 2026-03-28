let galleryImages = [];
const gal = document.getElementById('galleryMasonry');
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
    a.appendChild(im);
    gal.appendChild(a);
  });
  /* Lazy load within container */
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
  GLightbox({ selector: '.glightbox-item' });
}
function shuffleFade() {
  // Fade OUT
  gal.classList.add('fade-out');
  gal.classList.remove('fade-in');
  setTimeout(() => {
    // Replace with new randomized gallery
    renderGallery(shuffleArray([...galleryImages]));
    // Fade IN
    gal.classList.remove('fade-out');
    gal.classList.add('fade-in');
  }, 1200); // match CSS fade-out duration
}
async function initGallery() {
  const res = await fetch('assets/data/gallery.json');
  galleryImages = await res.json();
  renderGallery(shuffleArray([...galleryImages]));
  gal.classList.add('fade-in');
  // Every 7 seconds
  setInterval(shuffleFade, 7000);
}
document.addEventListener('DOMContentLoaded', initGallery);
