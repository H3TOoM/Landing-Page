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
    return; // Stop execution if db is not available
  }

  // Seed initial plogs from HTML to Firestore for SEO
  async function seedInitialPlogs() {
    const initialPlogsDiv = document.getElementById("initial-plogs");
    if (!initialPlogsDiv || !plogsRef) return;

    const snapshot = await plogsRef.limit(1).get();
    // Only seed if the collection is empty
    if (!snapshot.empty) {
      initialPlogsDiv.remove(); // Remove HTML data if DB is not empty
      return;
    }

    console.log("Seeding initial plogs to Firestore...");
    const plogItems = initialPlogsDiv.querySelectorAll(".plog-item");
    const batch = window.db.batch();

    plogItems.forEach(item => {
      const title = item.dataset.title;
      const content = item.querySelector('p').innerText;
      if (title && content) {
        const docRef = plogsRef.doc(); // Create a new doc reference
        batch.set(docRef, {
          title,
          content,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    await batch.commit();
    initialPlogsDiv.remove(); // Clean up the initial data from the DOM
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
    seedInitialPlogs().then(() => {
      plogsRef.orderBy("createdAt", "desc").onSnapshot(snapshot => {
        const plogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPlogs(plogs);
      });
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

// ====== Testimonial Modal Logic ======
const addTestimonialBtn = document.getElementById('add-testimonial-btn');
const testimonialModal = document.getElementById('testimonial-modal');
const closeTestimonialModal = document.getElementById('close-testimonial-modal');
const testimonialForm = document.getElementById('testimonial-form');
const testimonialImgInput = document.getElementById('testimonial-img');
const testimonialImgPreview = document.getElementById('testimonial-img-preview');
const testimonialName = document.getElementById('testimonial-name');
const testimonialComment = document.getElementById('testimonial-comment');
const testimonialTitle = document.getElementById('testimonial-title');
const testimonialRating = document.getElementById('testimonial-rating');
const testimonialStars = document.getElementById('testimonial-stars');

let testimonialImgFile = null;

if (addTestimonialBtn && testimonialModal && closeTestimonialModal) {
  addTestimonialBtn.onclick = () => {
    testimonialModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  closeTestimonialModal.onclick = () => {
    testimonialModal.style.display = 'none';
    document.body.style.overflow = '';
    testimonialForm.reset();
    testimonialImgPreview.innerHTML = '<i class="fas fa-user"></i>';
    testimonialImgPreview.classList.remove('bg-cover');
    testimonialImgFile = null;
  };
  testimonialModal.onclick = (e) => {
    if (e.target === testimonialModal) closeTestimonialModal.onclick();
  };
}

if (testimonialImgInput && testimonialImgPreview) {
  testimonialImgInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        testimonialImgPreview.style.backgroundImage = `url('${ev.target.result}')`;
        testimonialImgPreview.innerHTML = '';
        testimonialImgPreview.classList.add('bg-cover');
      };
      reader.readAsDataURL(file);
      testimonialImgFile = file;
    } else {
      testimonialImgPreview.innerHTML = '<i class="fas fa-user"></i>';
      testimonialImgPreview.style.backgroundImage = '';
      testimonialImgPreview.classList.remove('bg-cover');
      testimonialImgFile = null;
    }
  };
}

if (testimonialStars && testimonialRating) {
  testimonialStars.addEventListener('click', function (e) {
    if (e.target.classList.contains('star')) {
      const val = parseInt(e.target.getAttribute('data-value'));
      testimonialRating.value = val;
      updateStars(val);
    }
  });
  testimonialStars.addEventListener('mouseover', function (e) {
    if (e.target.classList.contains('star')) {
      updateStars(parseInt(e.target.getAttribute('data-value')));
    }
  });
  testimonialStars.addEventListener('mouseleave', function () {
    updateStars(parseInt(testimonialRating.value));
  });
  function updateStars(val) {
    Array.from(testimonialStars.children).forEach(star => {
      const starVal = parseInt(star.getAttribute('data-value'));
      if (starVal <= val) {
        star.classList.remove('fa-regular');
        star.classList.add('fa-solid', 'text-yellow-400');
      } else {
        star.classList.add('fa-regular');
        star.classList.remove('fa-solid', 'text-yellow-400');
      }
    });
  }
  updateStars(parseInt(testimonialRating.value));
}

if (testimonialForm) {
  testimonialForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = testimonialName.value.trim();
    const comment = testimonialComment.value.trim();
    const title = testimonialTitle.value.trim();
    const rating = parseInt(testimonialRating.value) || 5;
    if (!name || !comment || !title) return;
    let imgUrl = '';
    // رفع الصورة إلى Firebase Storage إذا وجدت
    if (testimonialImgFile) {
      try {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child('testimonials/' + Date.now() + '_' + testimonialImgFile.name);
        await fileRef.put(testimonialImgFile);
        imgUrl = await fileRef.getDownloadURL();
      } catch (err) {
        alert('حدث خطأ أثناء رفع الصورة!');
        return;
      }
    }
    // حفظ الرأي في Firestore
    try {
      const docRef = await window.db.collection('testimonials').add({
        name,
        comment,
        title,
        rating,
        img: imgUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // أضف الرأي الجديد مباشرة للـ swiper
      addTestimonialToSwiper({ name, comment, img: imgUrl, title, rating, id: docRef.id });
      testimonialModal.style.display = 'none';
      document.body.style.overflow = '';
      testimonialForm.reset();
      testimonialImgPreview.innerHTML = '<i class="fas fa-user"></i>';
      testimonialImgPreview.style.backgroundImage = '';
      testimonialImgPreview.classList.remove('bg-cover');
      testimonialImgFile = null;
      updateStars(5);
      testimonialRating.value = 5;
    } catch (err) {
      alert('حدث خطأ أثناء حفظ الرأي!');
    }
  };
}

// إضافة الرأي الجديد للـ swiper مباشرة
function addTestimonialToSwiper({ name, comment, img, title, rating, id }) {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slide = document.createElement('div');
  slide.className = 'swiper-slide group relative';
  slide.innerHTML = `
    <div class="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center max-w-md mx-auto hover:shadow-2xl transition duration-300 relative">
      ${img ? `<img src="${img}" alt="${name}" class="w-24 h-24 rounded-full border-4 border-white shadow-md -mt-20 mb-4 object-cover" />` : `<span class="w-24 h-24 rounded-full border-4 border-white shadow-md -mt-20 mb-4 flex items-center justify-center bg-gray-100 text-4xl text-gray-400"><i class="fas fa-user"></i></span>`}
      <h4 class="mt-2 font-bold text-[#7B8C6D] text-lg">${title || ''}</h4>
      <p class="text-gray-600 text-sm italic leading-relaxed">"${comment}"</p>
      <div class="flex justify-center mt-2 text-yellow-400">
        ${renderStars(rating || 5)}
      </div>
      <div class="mt-2 font-bold text-gray-800 text-base">${name}</div>
      <span class="text-sm text-[#7B8C6D]">عميل جديد</span>
    </div>
  `;
  swiperWrapper.prepend(slide);
  if (window.swiper && window.swiper.update) window.swiper.update();
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fa-star ${i <= rating ? 'fas text-yellow-400' : 'far'}"></i>`;
  }
  return html;
}

// ====== جلب التقييمات من فايربيز عند تحميل الصفحة ======
window.addEventListener('DOMContentLoaded', async () => {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  swiperWrapper.innerHTML = '';
  try {
    const snapshot = await window.db.collection('testimonials').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      swiperWrapper.innerHTML = `<div class='text-center text-gray-400 py-12'>لا توجد تقييمات بعد. كن أول من يشارك رأيه!</div>`;
      if (window.swiper && window.swiper.update) window.swiper.update();
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      addTestimonialToSwiper({
        name: data.name,
        comment: data.comment,
        img: data.img,
        title: data.title,
        rating: data.rating,
        id: doc.id
      });
    });
    if (window.swiper && window.swiper.update) window.swiper.update();
  } catch (err) {
    swiperWrapper.innerHTML = `<div class='text-center text-red-500 py-12'>حدث خطأ أثناء تحميل التقييمات!</div>`;
  }
});
