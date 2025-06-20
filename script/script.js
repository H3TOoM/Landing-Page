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

  // ========== Dark Mode Toggle ==========
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const themeIcon = document.getElementById("theme-icon");
  const themeIconMobile = document.getElementById("theme-icon-mobile");
  const htmlEl = document.documentElement;

  // Function to toggle theme
  const toggleTheme = () => {
    htmlEl.classList.toggle("dark");
    const isDarkMode = htmlEl.classList.contains("dark");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Update icons
    if (themeIcon) {
      themeIcon.classList.toggle("fa-moon", !isDarkMode);
      themeIcon.classList.toggle("fa-sun", isDarkMode);
    }
    if (themeIconMobile) {
      themeIconMobile.classList.toggle("fa-moon", !isDarkMode);
      themeIconMobile.classList.toggle("fa-sun", isDarkMode);
    }
  };

  // Add event listeners
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener("click", toggleTheme);
  }

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    if (savedTheme === "dark") {
      htmlEl.classList.add("dark");
      if (themeIcon) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
      }
      if (themeIconMobile) {
        themeIconMobile.classList.replace("fa-moon", "fa-sun");
      }
    }
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // If no theme is saved, check for user's OS preference
    htmlEl.classList.add("dark");
    if (themeIcon) {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
    if (themeIconMobile) {
      themeIconMobile.classList.replace("fa-moon", "fa-sun");
    }
  }
});

// ========== AOS Animation ==========
AOS.init({
  duration: 1000,
  once: true,
});

//  ==========swiper ==================
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".swiper-container", {
    loop: true,
    grabCursor: true,
    speed: 900,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 30,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

});
