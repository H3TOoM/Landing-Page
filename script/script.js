// ========== Navbar Toggle & Mobile Menu ==========
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const menuIcon = document.getElementById("menu-icon");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleBtn && menuIcon && mobileMenu) {
    // Toggle menu open/close
    toggleBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");

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
        mobileMenu.classList.remove("open");
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

//  ========== swiper js ==================
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

// ========== Plogs Section Logic (Firestore) ==========
document.addEventListener("DOMContentLoaded", function () {
  const plogsList = document.getElementById("plogs-list");
  const addBtn = document.getElementById("plog-add-btn");
  const form = document.getElementById("plog-form");
  const titleInput = document.getElementById("plog-title");
  const contentInput = document.getElementById("plog-content");
  const idInput = document.getElementById("plog-id");
  const cancelBtn = document.getElementById("plog-cancel");

  // Special confirm modal elements
  const confirmModal = document.getElementById("plog-confirm-modal");
  const confirmYes = document.getElementById("plog-confirm-yes");
  const confirmNo = document.getElementById("plog-confirm-no");
  let plogToDeleteId = null;

  // Helper: Firestore collection
  const plogsRef = window.db ? window.db.collection("plogs") : null;
  if (!window.db) {
    alert("تحذير: لم يتم تهيئة الاتصال بقاعدة البيانات (Firestore) بشكل صحيح. تأكد من إعداد firebaseConfig وترتيب السكريبتات.");
    console.warn("Firestore db is not initialized!");
  }

  // Render plogs
  function renderPlogs(plogs) {
    plogsList.innerHTML = "";
    if (!plogs.length) {
      plogsList.innerHTML = `<div class='col-span-full text-gray-500 text-lg' data-aos='fade-up'>لا توجد تدوينات بعد.</div>`;
      return;
    }
    plogs.forEach((plog, idx) => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-lg shadow-md p-6 text-right relative group hover:shadow-xl transition duration-300";
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", (idx % 3) * 100 + "");
      card.innerHTML = `
        <h3 class='text-xl font-bold text-[#7B8C6D] mb-2'>${plog.title}</h3>
        <p class='text-gray-700 mb-4 whitespace-pre-line'>${plog.content}</p>
        <div class='flex gap-2 absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button class='plog-edit bg-[#7B8C6D] text-white px-3 py-1 rounded hover:bg-[#657458] transition' title='تعديل'><i class='fas fa-edit'></i></button>
          <button class='plog-delete bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition' title='حذف'><i class='fas fa-trash'></i></button>
        </div>
      `;
      // Edit
      card.querySelector(".plog-edit").onclick = () => {
        form.style.display = "flex";
        addBtn.style.display = "none";
        titleInput.value = plog.title;
        contentInput.value = plog.content;
        idInput.value = plog.id;
        titleInput.focus();
      };
      // Delete
      card.querySelector(".plog-delete").onclick = () => {
        plogToDeleteId = plog.id;
        if (confirmModal) {
          confirmModal.style.display = "flex";
          if (window.AOS) AOS.refresh();
        }
      };
      plogsList.appendChild(card);
    });
    if (window.AOS) AOS.refresh();
  }

  // Listen for real-time updates
  if (plogsRef) {
    plogsRef.orderBy("createdAt", "desc").onSnapshot(snapshot => {
      const plogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderPlogs(plogs);
    });
  }

  // Confirm modal logic
  if (confirmModal && confirmYes && confirmNo) {
    confirmNo.onclick = () => {
      confirmModal.style.display = "none";
      plogToDeleteId = null;
    };
    confirmYes.onclick = async () => {
      if (plogToDeleteId && plogsRef) {
        await plogsRef.doc(plogToDeleteId).delete();
      }
      confirmModal.style.display = "none";
      plogToDeleteId = null;
    };
  }
  // Show add form
  addBtn.onclick = () => {
    form.style.display = "flex";
    addBtn.style.display = "none";
    titleInput.value = "";
    contentInput.value = "";
    idInput.value = "";
    titleInput.focus();
  };
  // Cancel form
  cancelBtn.onclick = () => {
    form.style.display = "none";
    addBtn.style.display = "inline-block";
  };
  // Submit form
  form.onsubmit = async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const id = idInput.value;
    if (!title || !content || !plogsRef) return;
    try {
      if (id) {
        // Edit
        await plogsRef.doc(id).update({ title, content });
      } else {
        // Add
        await plogsRef.add({
          title,
          content,
          createdAt: firebase.firestore.FieldValue ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
        });
      }
      form.style.display = "none";
      addBtn.style.display = "inline-block";
      titleInput.value = "";
      contentInput.value = "";
      idInput.value = "";
    } catch (err) {
      alert("حدث خطأ أثناء إضافة التدوينة!\n" + (err.message || err));
      console.error(err);
    }
  };
});

// ========== Special Alert Logic ==========
document.addEventListener("DOMContentLoaded", function () {
  const alertEl = document.getElementById("special-alert");
  const closeBtn = document.getElementById("special-alert-close");
  if (!alertEl || !closeBtn) return;
  // Show alert if not dismissed
  if (!localStorage.getItem("specialAlertDismissed")) {
    alertEl.style.display = "flex";
    if (window.AOS) AOS.refresh();
  }
  closeBtn.onclick = function () {
    alertEl.style.display = "none";
    localStorage.setItem("specialAlertDismissed", "1");
  };
});

// ========== Welcome Toast Logic ==========
document.addEventListener("DOMContentLoaded", function () {
  const toast = document.getElementById("welcome-toast");
  const progress = document.getElementById("toast-progress");
  if (!toast || !progress) return;
  if (!sessionStorage.getItem("welcomeToastShown")) {
    toast.style.display = "flex";
    setTimeout(() => toast.style.opacity = 1, 10);
    let duration = 4000; // 4 seconds
    let start = null;
    function animate(ts) {
      if (!start) start = ts;
      let elapsed = ts - start;
      let percent = Math.max(0, 1 - elapsed / duration);
      progress.style.width = (percent * 100) + "%";
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        toast.style.opacity = 0;
        setTimeout(() => toast.style.display = "none", 500);
      }
    }
    requestAnimationFrame(animate);
    sessionStorage.setItem("welcomeToastShown", "1");
  }
});

console.log(typeof firebase, typeof firebase.firestore);
