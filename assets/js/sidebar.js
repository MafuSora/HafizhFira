/*
  SIDEBAR NAV — ELEGAN, RESPONSIVE, SNAP SUPPORT
*/
const sidebar = document.getElementById("sidebarNav");
const items = document.querySelectorAll(".sidebar-item");
// SHOW SIDEBAR setelah amplop hilang
document.addEventListener("bukaUndangan", () => {
  setTimeout(() => {
    sidebar.classList.add("show");
  }, 700);
});
// Scroll ke section
items.forEach(item => {
  item.addEventListener("click", () => {
    const target = document.querySelector(item.dataset.target);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
// Highlight section aktif
const sectionTargets = [...items].map(i => document.querySelector(i.dataset.target));
window.addEventListener("scroll", () => {
  let scrollPos = window.scrollY + window.innerHeight/2;
  sectionTargets.forEach((sec, index) => {
    const rect = sec.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = top + sec.offsetHeight;
    if (scrollPos >= top && scrollPos <= bottom) {
      items.forEach(i => i.classList.remove("active"));
      items[index].classList.add("active");
    }
  });
});

const sidebarToggle = document.getElementById("sidebarToggle");
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-hidden");
});
