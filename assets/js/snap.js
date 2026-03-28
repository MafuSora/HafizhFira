/*
  AUTO SNAP CORRECTION – MODE 2
*/
const container = document.getElementById("mainContainer");
let isSnapping = false;
function snapToCenter() {
  if (isSnapping) return;
  isSnapping = true;
  setTimeout(() => {
    const sections = document.querySelectorAll(".snap-section");
    let nearest = null;
    let minDistance = Infinity;
    const middle = window.innerHeight / 2;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const secMiddle = rect.top + rect.height / 2;
      const dist = Math.abs(secMiddle - middle);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = sec;
      }
    });
    if (nearest) {
      nearest.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => { isSnapping = false; }, 400);
  }, 150);
}
container.addEventListener("scroll", () => {
  clearTimeout(container.snapTimeout);
  container.snapTimeout = setTimeout(snapToCenter, 120);
});
