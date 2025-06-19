// ========== Navbar Toggle & Mobile Menu ==========
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const menuIcon = document.getElementById("menu-icon");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleBtn && menuIcon && mobileMenu) {
    // Toggle menu open/close
    toggleBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");

      menuIcon.classList.add("rotate-180", "duration-300");

      setTimeout(() => {
        menuIcon.classList.remove("rotate-180");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-times");
      }, 150);
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        if (menuIcon.classList.contains("fa-times")) {
          menuIcon.classList.remove("fa-times");
          menuIcon.classList.add("fa-bars");
        }
      });
    });
  }


  // ========== Footer Year ==========
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ========== Scroll to Top ==========
  const toTopBtn = document.getElementById("toTopBtn");
  window.addEventListener("scroll", () => {
    if (toTopBtn) {
      toTopBtn.classList.toggle("hidden", window.scrollY <= 300);
    }
  });
});

// ========== AOS Animation ==========
AOS.init({
  duration: 1000,
  once: true,
});

// ========== Scroll to Top Function ==========
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
