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
    // alert("تحذير: لم يتم تهيئة الاتصال بقاعدة البيانات (Firestore) بشكل صحيح. تأكد من إعداد firebaseConfig وترتيب السكريبتات.");
    console.warn("Firestore db is not initialized!");
    return; // Stop execution if db is not available
  }

  // Seed initial plogs from HTML to Firestore for SEO
  async function seedInitialPlogs() {
    if (!plogsRef) return;

    console.log("Seeding initial plogs to Firestore...");

    // Default blog posts if HTML data is not available
    const defaultPlogs = [
      {
        title: "5 نصائح ذهبية لاختيار أفضل شركة نقل عفش بالرياض",
        content: `الانتقال إلى منزل جديد في الرياض يمكن أن يكون مهمة مرهقة، واختيار شركة نقل العفش المناسبة هو مفتاح التجربة الناجحة. إليك 5 نصائح لمساعدتك:

1. **البحث والمقارنة:** لا تعتمد على أول شركة تجدها. ابحث عن 3-4 شركات نقل عفش بالرياض وقارن بين خدماتهم وأسعارهم.

2. **قراءة تقييمات العملاء:** التقييمات على جوجل أو مواقع التواصل الاجتماعي تعطيك فكرة حقيقية عن جودة الخدمة.

3. **التأكد من التراخيص:** اختر شركة نقل أثاث مرخصة لضمان حقوقك وسلامة ممتلكاتك.

4. **طلب عرض سعر مكتوب:** اطلب تفاصيل التكلفة شاملة (تغليف، نقل، فك وتركيب) لتجنب أي رسوم مفاجئة.

5. **خدمات التغليف:** تأكد من أن الشركة تستخدم مواد تغليف عالية الجودة لحماية الأثاث من الخدوش والكسر.

باتباع هذه النصائح، ستضمن تجربة نقل عفش آمنة ومريحة داخل الرياض.`
      },
      {
        title: "خطوات تغليف الأثاث باحترافية لضمان نقله بأمان",
        content: `تغليف الأثاث بشكل صحيح هو أهم خطوة لضمان وصوله سليمًا. شركة الهرم للنقل تقدم لك هذه الخطوات الأساسية:

- **تجهيز المواد:** ستحتاج إلى (كراتين مقواة، بلاستيك الفقاعات، شريط لاصق، وأغطية واقية).

- **تفكيك القطع الكبيرة:** قم بفك أرجل الطاولات والمكاتب لسهولة النقل والتغليف.

- **تغليف القطع الزجاجية:** استخدم بلاستيك الفقاعات بشكل مكثف حول المرايا والألواح الزجاجية وضعها في كراتين مسطحة.

- **حماية الأجهزة الكهربائية:** استخدم كراتينها الأصلية إن أمكن، أو اغلفها ببطانيات وبلاستيك الفقاعات.

- **كتابة المحتويات:** اكتب على كل كرتونة محتوياتها والغرفة التابعة لها لتسهيل عملية التفريغ.

هذه الخطوات تضمن لك نقل أثاثك بأمان تام، وهي جزء من خدمتنا الاحترافية في نقل العفش داخل الرياض.`
      },
      {
        title: "كم تكلفة نقل العفش داخل أحياء الرياض؟",
        content: `تعتمد تكلفة نقل العفش داخل الرياض على عدة عوامل أساسية، وفهمها يساعدك في الحصول على أفضل سعر:

- **حجم العفش:** عدد الغرف وكمية الأثاث هو العامل الأكبر في تحديد السعر.

- **المسافة بين الموقعين:** تكلفة النقل من شمال الرياض إلى جنوبها تختلف عن النقل في نفس الحي.

- **الطابق:** النقل من وإلى الأدوار المرتفعة قد يزيد من التكلفة إذا تطلب معدات خاصة.

- **خدمات إضافية:** هل تحتاج إلى فك وتركيب مكيفات اسبلت أو تغليف خاص للقطع الثمينة؟

للحصول على عرض سعر دقيق، تواصل مع شركة نقل عفش موثوقة في الرياض مثل شركة الهرم وقدم لهم كل هذه التفاصيل. نحن نقدم أسعارًا تنافسية وخدمة شفافة.`
      }
    ];

    const batch = window.db.batch();

    defaultPlogs.forEach(plog => {
      const docRef = plogsRef.doc(); // Create a new doc reference
      batch.set(docRef, {
        title: plog.title,
        content: plog.content,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    console.log("Initial plogs seeded successfully!");
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
    // Check if we need to seed initial data and set up listener
    (async () => {
      const snapshot = await plogsRef.limit(1).get();
      if (snapshot.empty) {
        // Only seed if collection is empty
        await seedInitialPlogs();
      }

      // Set up real-time listener
      plogsRef.orderBy("createdAt", "desc").onSnapshot(snapshot => {
        const plogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPlogs(plogs);
      });
    })();
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

// ====== fetch data from firbase ======
window.addEventListener('DOMContentLoaded', async () => {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  swiperWrapper.innerHTML = '';
  try {
    const snapshot = await window.db.collection('testimonials').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      swiperWrapper.innerHTML = `<div class='text-center text-gray-400 py-12'>لا توجد تقييمات بعد. كن أول من يشارك رأيه!</div>`;
      if (window.swiper && window.swiper.update) window.swiper.update();
      updateTestimonialsSchema([]);
      return;
    }
    const allTestimonials = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      allTestimonials.push({
        name: data.name,
        comment: data.comment,
        img: data.img,
        title: data.title,
        rating: data.rating,
        id: doc.id
      });
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
    // أضف مخطط schema
    updateTestimonialsSchema(allTestimonials);
  } catch (err) {
    swiperWrapper.innerHTML = `<div class='text-center text-red-500 py-12'>حدث خطأ أثناء تحميل التقييمات!</div>`;
    updateTestimonialsSchema([]);
  }
});

// توليد كود schema.org Review/AggregateRating
function updateTestimonialsSchema(testimonials) {
  const schemaEl = document.getElementById('testimonials-schema');
  if (!schemaEl) return;
  if (!testimonials.length) {
    schemaEl.textContent = '';
    return;
  }
  // حساب المتوسط وعدد التقييمات
  const ratings = testimonials.map(t => Number(t.rating) || 5);
  const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
  const reviewCount = ratings.length;
  // عينة من أول 3 تقييمات
  const reviews = testimonials.slice(0, 3).map(t => ({
    "@type": "Review",
    "author": t.name,
    "reviewBody": t.comment,
    "name": t.title,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": t.rating || 5,
      "bestRating": 5,
      "worstRating": 1
    }
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "شركة الهرم للنقل - تقييمات العملاء",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews
  };
  schemaEl.textContent = JSON.stringify(schema, null, 2);
}

// ========== Service Modal Logic ==========
document.addEventListener("DOMContentLoaded", function () {
  const serviceModal = document.getElementById("service-modal");
  const closeServiceModal = document.getElementById("close-service-modal");

  // بيانات الخدمات
  const servicesData = {
    'packing': {
      title: 'تغليف العفش',
      icon: 'fas fa-box',
      description: 'نوفر خدمة تغليف احترافية ومتخصصة لجميع أنواع الأثاث والعفش باستخدام أحدث المواد والتقنيات لضمان الحماية الكاملة أثناء النقل.',
      features: [
        'استخدام مواد تغليف عالية الجودة',
        'تغليف خاص للقطع الزجاجية والمرايا',
        'تغليف الأجهزة الكهربائية بمواد واقية',
        'تغليف الأثاث الخشبي ببطانيات خاصة',
        'تغليف الكتب والأغراض الصغيرة في كراتين مقواة',
        'كتابة محتويات كل كرتونة للسهولة'
      ],
      pricing: 'أسعار التغليف تبدأ من 50 ريال للغرفة الواحدة، مع خصومات خاصة للشقق الكاملة.',
      articles: [
        {
          title: 'أفضل طرق تغليف الأثاث الخشبي',
          content: `الأثاث الخشبي من أكثر القطع حساسية أثناء النقل، لذلك نتبع طرق تغليف متخصصة لضمان سلامته.

**المواد المستخدمة:**
نستخدم بطانيات قطنية ناعمة عالية الجودة، وورق فقاعات مزدوج الطبقات، وأكياس بلاستيكية واقية، وشريط لاصق قوي.

**خطوات التغليف:**
1. تنظيف الأثاث من الغبار والأتربة
2. تغليف الأسطح الخشبية ببطانيات قطنية
3. إضافة طبقة من ورق الفقاعات
4. تغليف الأرجل والزوايا بشكل منفصل
5. وضع علامات واضحة على كل قطعة

**نصائح مهمة:**
- نغلف كل قطعة بشكل منفصل لتجنب الاحتكاك
- نضع قطع صغيرة من الكرتون بين الأثاث لمنع الخدوش
- نستخدم أكياس بلاستيكية لحماية الأثاث من الرطوبة
- نضع علامات "هش" على القطع الحساسة

**الضمان:**
نضمن لك وصول الأثاث الخشبي سليماً تماماً، وإذا حدث أي ضرر نتحمل مسؤولية إصلاحه أو تعويضك.`
        },
        {
          title: 'كيفية تغليف المرايا والألواح الزجاجية',
          content: `المرايا والألواح الزجاجية من أكثر القطع حساسية وتحتاج إلى عناية خاصة أثناء التغليف والنقل.

**التجهيزات الخاصة:**
نستخدم كراتين مقواة مخصصة للزجاج، وبطانيات واقية سميكة، وشرائط لاصقة خاصة، وعلامات تحذير واضحة.

**خطوات التغليف:**
1. تنظيف المرايا والألواح الزجاجية جيداً
2. تغليفها ببطانيات واقية سميكة
3. وضعها في كراتين مقواة مخصصة
4. إضافة مواد حشو إضافية لمنع الحركة
5. وضع علامات "زجاج" و "هش" واضحة

**معدات النقل:**
- صناديق مخصصة للزجاج مع حشو داخلي
- عربات نقالة مبطنة
- سيارات مجهزة خصيصاً للزجاج
- فريق مدرب على التعامل مع الزجاج

**الضمان والسلامة:**
نضمن سلامة المرايا والألواح الزجاجية بنسبة 100%، ونستخدم أحدث التقنيات والمعدات لضمان النقل الآمن.`
        },
        {
          title: 'تغليف الأجهزة الكهربائية بأمان',
          content: `الأجهزة الكهربائية تحتاج إلى تغليف خاص لحماية المكونات الداخلية والوصلات الكهربائية.

**الأجهزة التي نتعامل معها:**
- الثلاجات والغسالات
- التلفزيونات والشاشات
- أجهزة الكمبيوتر والطابعات
- الأجهزة الصغيرة (الخلاطات، الميكروويف)

**خطوات التغليف:**
1. فك جميع الكابلات والتوصيلات
2. تنظيف الأجهزة من الغبار
3. تغليف الكابلات بشكل منفصل
4. استخدام الكراتين الأصلية إن أمكن
5. إضافة بطانيات واقية إضافية
6. وضع الأجهزة في وضع آمن للنقل

**المواد المستخدمة:**
- كراتين مقواة عالية الجودة
- بطانيات واقية سميكة
- أكياس بلاستيكية للكابلات
- شريط لاصق قوي
- مواد حشو لمنع الحركة

**فحص ما بعد النقل:**
نقوم بفحص جميع الأجهزة بعد النقل للتأكد من سلامتها، وإعادة توصيلها واختبارها قبل تسليمها لك.`
        }
      ],
      keywords: [
        'تغليف عفش', 'تغليف أثاث', 'شركة تغليف عفش', 'تغليف عفش بالرياض', 'تغليف اثاث بالرياض',
        'مواد تغليف عفش', 'تغليف اثاث احترافي', 'تغليف اثاث منازل', 'تغليف اثاث مكتبي',
        'تغليف مراتب', 'تغليف ستائر', 'تغليف سجاد', 'تغليف أجهزة كهربائية',
        'شركة نقل عفش', 'نقل عفش مع التغليف', 'تغليف عفش آمن', 'تغليف عفش سريع',
        'تغليف عفش رخيص', 'تغليف عفش فاخر', 'تغليف عفش شمال الرياض', 'تغليف عفش شرق الرياض',
        'تغليف عفش غرب الرياض', 'تغليف عفش جنوب الرياض', 'تغليف عفش مع الفك والتركيب',
        'تغليف عفش ضد الكسر', 'تغليف عفش ضد الخدش', 'تغليف عفش شقق', 'تغليف عفش فلل',
        'تغليف عفش شركات', 'تغليف عفش منازل', 'تغليف عفش مستعجل', 'تغليف عفش مع نقل',
        'تغليف عفش مع تخزين', 'تغليف عفش مع شحن', 'تغليف عفش مع ترتيب',
        'افضل شركة تغليف عفش', 'ارخص شركة تغليف عفش', 'تغليف اثاث خشب', 'تغليف اثاث مودرن',
        'تغليف اثاث كلاسيك', 'تغليف اثاث غرف نوم', 'تغليف اثاث غرف اطفال',
        'تغليف اثاث مجالس', 'تغليف اثاث صالونات', 'تغليف اثاث مكاتب',
        'تغليف اثاث مطابخ', 'تغليف اثاث صالات', 'تغليف اثاث استقبال',
        'تغليف اثاث فاخر', 'تغليف اثاث اقتصادي', 'تغليف اثاث سريع',
        'تغليف اثاث آمن', 'تغليف اثاث ضد الكسر', 'تغليف اثاث ضد الخدش',
        'تغليف اثاث مع الفك والتركيب', 'تغليف اثاث مع النقل', 'تغليف اثاث مع الشحن',
        'تغليف اثاث مع التخزين', 'تغليف اثاث مع الترتيب',
      ]
    },
    'local-moving': {
      title: 'نقل داخلي',
      icon: 'fas fa-truck',
      description: 'خدمة نقل احترافية داخل مدينة الرياض بالكامل، مع سيارات مجهزة خصيصاً لنقل الأثاث وفريق عمل مدرب ومحترف.',
      features: [
        'سيارات مجهزة خصيصاً لنقل الأثاث',
        'سائقين محترفين ومدربين',
        'خدمة متوفرة 24/7',
        'نقل آمن وسريع داخل الرياض',
        'تأمين شامل على الأثاث',
        'التزام بالمواعيد المحددة'
      ],
      pricing: 'أسعار النقل الداخلي تبدأ من 200 ريال حسب المسافة وحجم الأثاث، مع عروض خاصة للشقق الكاملة.',
      articles: [
        {
          title: 'أفضل شركة نقل عفش في الرياض',
          content: `شركة الهرم للنقل هي الخيار الأمثل لنقل العفش في الرياض، ونتميز بالخبرة الطويلة والسمعة الممتازة في مجال النقل.

**لماذا تختار شركة الهرم؟**
- خبرة أكثر من 10 سنوات في مجال النقل
- فريق محترف ومدرب على أعلى المستويات
- سيارات مجهزة خصيصاً لنقل الأثاث
- ضمان شامل على جميع الخدمات
- أسعار تنافسية وشفافة

**المناطق التي نخدمها:**
نخدم جميع أحياء الرياض من شمالها إلى جنوبها، ومن شرقها إلى غربها، بما في ذلك:
- حي العليا والنرجس والروضة
- حي الملقا والملز والنسيم
- حي النخيل والياسمين والربوة
- حي حطين والشفا والدرعية
- وجميع الأحياء الأخرى في الرياض

**الخدمات المقدمة:**
- نقل آمن وسريع
- تغليف احترافي
- فك وتركيب الأثاث
- ضمان سلامة الممتلكات
- خدمة 24/7

**الضمان:**
نضمن لك نقل آمن وسريع مع الحفاظ على سلامة جميع ممتلكاتك، وإذا حدث أي ضرر نتحمل مسؤولية إصلاحه أو تعويضك.`
        },
        {
          title: 'نقل عفش من الرياض إلى الرياض',
          content: `نقدم خدمة نقل عفش شاملة داخل مدينة الرياض، مع ضمان الجودة والسرعة في جميع المناطق.

**سياراتنا المجهزة:**
- سيارات نقل كبيرة ومتوسطة
- مجهزة خصيصاً لنقل الأثاث
- معدات رفع وتحميل حديثة
- بطانيات واقية عالية الجودة
- أحزمة تثبيت متخصصة

**فريق العمل:**
- سائقين محترفين ومدربين
- عمال نقل ذوي خبرة
- فنيين متخصصين في الفك والتركيب
- مشرفين على العملية بالكامل

**خطوات النقل:**
1. زيارة الموقع وتقييم العفش
2. تقديم عرض سعر مفصل
3. تحديد موعد النقل
4. تجهيز المواد والمعدات
5. تنفيذ عملية النقل
6. فك وتركيب في الموقع الجديد
7. التأكد من رضا العميل

**الوقت المتوقع:**
- شقة صغيرة: 3-4 ساعات
- شقة متوسطة: 4-6 ساعات
- شقة كبيرة: 6-8 ساعات
- فيلا: 8-12 ساعة

**الضمان والسلامة:**
نضمن سلامة جميع ممتلكاتك بنسبة 100%، ونستخدم أحدث التقنيات والمعدات لضمان النقل الآمن.`
        },
        {
          title: 'أسعار نقل العفش في الرياض 2024',
          content: `نقدم أسعار تنافسية وشفافة لجميع خدمات النقل، مع خصومات خاصة للشقق الكاملة والمنازل الكبيرة.

**الأسعار الأساسية:**
- شقة صغيرة (غرفة أو غرفتين): 200-300 ريال
- شقة متوسطة (3-4 غرف): 300-500 ريال
- شقة كبيرة (5-6 غرف): 500-800 ريال
- فيلا صغيرة: 800-1200 ريال
- فيلا كبيرة: 1200-2000 ريال

**ما يشمل السعر:**
- التغليف الكامل للأثاث
- النقل الآمن
- الفك والتركيب
- المواد والمعدات
- فريق العمل المحترف
- الضمان الشامل

**الخصومات المتاحة:**
- خصم 10% للشقق الكاملة
- خصم 15% للفيلات
- خصم 20% للعائلات الكبيرة
- خصم خاص للطلبات المتكررة

**عروض خاصة:**
- عرض الشهر: خصم 25% على النقل الداخلي
- عرض الطلاب: خصم 30% للطلاب
- عرض المسنين: خصم 20% للمسنين
- عرض العائلات: خصم 15% للعائلات الكبيرة

**طرق الدفع:**
- نقداً عند التسليم
- تحويل بنكي
- بطاقات الائتمان
- أقساط شهرية (للطلبات الكبيرة)

**الضمان:**
نضمن لك أسعار عادلة وشفافة، ولا توجد رسوم خفية أو إضافية.`
        },
        {
          title: 'نقل عفش سريع في الرياض',
          content: `نضمن لك نقل سريع وآمن مع الحفاظ على جودة الخدمة، ونستخدم أحدث التقنيات لضمان السرعة والدقة.

**مميزات النقل السريع:**
- فريق عمل كبير ومتخصص
- سيارات متعددة للعمل المتوازي
- معدات حديثة وسريعة
- تخطيط دقيق لمسار النقل
- تنسيق مع إدارة المرور

**الوقت المتوقع للنقل السريع:**
- شقة صغيرة: 2-3 ساعات
- شقة متوسطة: 3-4 ساعات
- شقة كبيرة: 4-6 ساعات
- فيلا: 6-8 ساعات

**تقنيات النقل السريع:**
- استخدام سيارات متعددة
- تقسيم العمل بين الفرق
- استخدام معدات حديثة
- تخطيط المسار الأمثل
- تنسيق مع العميل مسبقاً

**الضمان:**
نضمن لك النقل السريع مع الحفاظ على جودة الخدمة وسلامة الممتلكات، وإذا تأخرنا عن الوقت المحدد نقدم خصم 10% على السعر الإجمالي.

**خدمة الطوارئ:**
نوفر خدمة نقل طوارئ على مدار الساعة للعملاء الذين يحتاجون نقل سريع وفوري.`
        }
      ],
      keywords: ['نقل عفش الرياض', 'شركة نقل أثاث الرياض', 'نقل داخلي الرياض', 'أسعار نقل عفش', 'نقل سريع', 'نقل آمن', 'فريق محترف', 'سيارات مجهزة']
    },
    'furniture': {
      title: 'فك وتركيب الأثاث',
      icon: 'fas fa-tools',
      description: 'فريق متخصص من الفنيين المحترفين في فك وتركيب جميع أنواع الأثاث بكل دقة وأمان، مع ضمان سلامة القطع.',
      features: [
        'فنيون متخصصون في فك وتركيب الأثاث',
        'أدوات حديثة ومتخصصة',
        'فك وتركيب جميع أنواع الأثاث',
        'ضمان سلامة القطع أثناء العمل',
        'تركيب دقيق ومحترف',
        'خدمة سريعة وفعالة'
      ],
      pricing: 'أسعار فك وتركيب الأثاث تبدأ من 100 ريال حسب نوع وكمية الأثاث.',
      articles: [
        {
          title: 'فك وتركيب الأثاث في الرياض',
          content: 'نقدم خدمة فك وتركيب الأثاث باحترافية عالية. فريقنا مدرب على التعامل مع جميع أنواع الأثاث من غرف النوم والمطابخ والمكاتب. نستخدم أدوات حديثة ومتخصصة لضمان الدقة والأمان.'
        },
        {
          title: 'أسعار فك وتركيب الأثاث',
          content: 'أسعارنا تنافسية وشفافة. نبدأ من 100 ريال حسب نوع وكمية الأثاث. نقدم خصومات للشقق الكاملة والمنازل الكبيرة. الأسعار تشمل الفك والتركيب والضمان.'
        },
        {
          title: 'فني فك وتركيب أثاث محترف',
          content: 'فريقنا من الفنيين المحترفين المدربين على فك وتركيب جميع أنواع الأثاث. نضمن لك تركيب دقيق ومحترف مع الحفاظ على سلامة القطع. نستخدم أحدث الأدوات والتقنيات.'
        },
        {
          title: 'فك وتركيب غرف النوم',
          content: 'نخصص فنيين متخصصين لفك وتركيب غرف النوم. من الأسرة والخزائن إلى الطاولات والمرايا. نضمن لك تركيب دقيق ومحترف مع الحفاظ على جمال الأثاث.'
        }
      ],
      keywords: ['فك وتركيب أثاث الرياض', 'فني أثاث', 'تركيب غرف نوم', 'فك أثاث', 'تركيب مطابخ', 'فني محترف', 'أدوات حديثة', 'ضمان الجودة']
    },
    'ac': {
      title: 'فك وتركيب مكيفات اسبلت',
      icon: 'fas fa-snowflake',
      description: 'خدمة فك وتركيب مكيفات الاسبلت باحترافية عالية، مع ضمان سلامة الأجهزة والتوصيلات الكهربائية.',
      features: [
        'فنيون متخصصون في المكيفات',
        'فك آمن للمكيفات بدون تلف',
        'تركيب احترافي مع ضمان الجودة',
        'فحص التوصيلات الكهربائية',
        'تنظيف المكيفات أثناء التركيب',
        'ضمان على العمل لمدة شهر'
      ],
      pricing: 'أسعار فك وتركيب المكيفات تبدأ من 150 ريال للمكيف الواحد.',
      articles: [
        {
          title: 'فك وتركيب مكيفات اسبلت في الرياض',
          content: 'نقدم خدمة فك وتركيب مكيفات الاسبلت باحترافية عالية. فريقنا متخصص في التعامل مع جميع أنواع المكيفات. نضمن سلامة الأجهزة والتوصيلات الكهربائية مع ضمان على العمل.'
        },
        {
          title: 'أسعار فك وتركيب المكيفات',
          content: 'أسعارنا تنافسية وشفافة. نبدأ من 150 ريال للمكيف الواحد. نقدم خصومات للشقق والمنازل التي تحتوي على عدة مكيفات. الأسعار تشمل الفك والتركيب والضمان.'
        },
        {
          title: 'فني مكيفات محترف في الرياض',
          content: 'فريقنا من الفنيين المحترفين المدربين على فك وتركيب جميع أنواع المكيفات. نستخدم أحدث المعدات والتقنيات لضمان العمل باحترافية عالية. نضمن لك راحة البال مع ضمان على العمل.'
        },
        {
          title: 'صيانة مكيفات اسبلت',
          content: 'نقدم أيضاً خدمات صيانة المكيفات. من تنظيف الفلاتر إلى إصلاح الأعطال البسيطة. فريقنا مدرب على التعامل مع جميع أنواع الأعطال وضمان عمل المكيف بكفاءة عالية.'
        }
      ],
      keywords: ['فك مكيفات الرياض', 'تركيب مكيفات اسبلت', 'فني مكيفات', 'صيانة مكيفات', 'مكيفات اسبلت', 'فك وتركيب', 'ضمان مكيفات', 'فني محترف']
    },
    'cleaning': {
      title: 'تنظيف الوحدات السكنية والمنشآت الإدارية',
      icon: 'fas fa-broom',
      description: 'خدمة تنظيف شاملة ومتخصصة للوحدات السكنية والمنشآت الإدارية بأحدث المعدات ومواد التنظيف الآمنة.',
      features: [
        'تنظيف شامل للغرف والحمامات',
        'تنظيف المطابخ والأجهزة',
        'تنظيف النوافذ والمرايا',
        'تنظيف الأرضيات والسجاد',
        'مواد تنظيف آمنة وصديقة للبيئة',
        'فريق تنظيف مدرب ومحترف'
      ],
      pricing: 'أسعار التنظيف تبدأ من 300 ريال للشقة الصغيرة، مع عروض خاصة للشقق الكبيرة والمنشآت.',
      articles: [
        {
          title: 'شركة تنظيف منازل في الرياض',
          content: 'نقدم خدمة تنظيف منازل شاملة ومتخصصة. فريقنا مدرب على تنظيف جميع أنواع المنازل والشقق. نستخدم أحدث المعدات ومواد التنظيف الآمنة والصديقة للبيئة.'
        },
        {
          title: 'تنظيف شقق مفروشة في الرياض',
          content: 'نخصص خدمة تنظيف للشقق المفروشة. من تنظيف الغرف والحمامات إلى المطابخ والأجهزة. نضمن لك تنظيف شامل ومحترف مع ضمان الجودة.'
        },
        {
          title: 'أسعار تنظيف المنازل',
          content: 'أسعارنا تنافسية وشفافة. نبدأ من 300 ريال للشقة الصغيرة مع خصومات للشقق الكبيرة والمنازل. نقدم عروض خاصة للتنظيف الدوري والمنشآت الإدارية.'
        },
        {
          title: 'تنظيف مكاتب وشركات',
          content: 'نقدم خدمة تنظيف للمكاتب والشركات. من تنظيف المكاتب والغرف إلى الحمامات والمطابخ. فريقنا مدرب على التعامل مع جميع أنواع المنشآت التجارية.'
        },
        {
          title: 'تنظيف بعد السكن',
          content: 'نخصص خدمة تنظيف بعد السكن. تنظيف شامل للمنزل أو الشقة بعد مغادرة المستأجرين. نضمن لك تنظيف شامل ومحترف لاستقبال مستأجرين جدد.'
        }
      ],
      keywords: ['شركة تنظيف الرياض', 'تنظيف منازل', 'تنظيف شقق', 'تنظيف مكاتب', 'تنظيف بعد سكن', 'فريق تنظيف', 'مواد تنظيف', 'تنظيف احترافي']
    },
    'heavy-appliances': {
      title: 'نقل الأجهزة الكهربائية الثقيلة',
      icon: 'fas fa-plug',
      description: 'خدمة نقل متخصصة للأجهزة الكهربائية الكبيرة مثل الثلاجات والغسالات باحترافية وأمان تام.',
      features: [
        'فريق متخصص في نقل الأجهزة الثقيلة',
        'معدات حديثة لرفع الأجهزة',
        'نقل آمن للثلاجات والغسالات',
        'فك وتركيب الأجهزة الكهربائية',
        'فحص الأجهزة بعد التركيب',
        'ضمان سلامة الأجهزة أثناء النقل'
      ],
      pricing: 'أسعار نقل الأجهزة الكهربائية تبدأ من 80 ريال للجهاز الواحد.',
      articles: [
        {
          title: 'نقل ثلاجات وغسالات في الرياض',
          content: 'نقدم خدمة نقل متخصصة للأجهزة الكهربائية الثقيلة. من الثلاجات والغسالات إلى المجففات والغسالات الأوتوماتيكية. فريقنا مدرب على التعامل مع جميع أنواع الأجهزة بأمان تام.'
        },
        {
          title: 'أسعار نقل الأجهزة الكهربائية',
          content: 'أسعارنا تنافسية وشفافة. نبدأ من 80 ريال للجهاز الواحد مع خصومات للشقق والمنازل التي تحتوي على عدة أجهزة. الأسعار تشمل النقل والفك والتركيب والضمان.'
        },
        {
          title: 'فك وتركيب أجهزة كهربائية',
          content: 'نقدم خدمة فك وتركيب الأجهزة الكهربائية. من فك التوصيلات الكهربائية إلى إعادة التركيب والفحص. فريقنا متخصص في التعامل مع جميع أنواع الأجهزة وضمان عملها بكفاءة.'
        },
        {
          title: 'نقل آمن للأجهزة الحساسة',
          content: 'نستخدم معدات حديثة ومتخصصة لنقل الأجهزة الحساسة. من معدات الرفع إلى وسائل الحماية والتغليف. نضمن لك نقل آمن وسليم لجميع الأجهزة الكهربائية.'
        },
        {
          title: 'صيانة أجهزة كهربائية',
          content: 'نقدم أيضاً خدمات صيانة الأجهزة الكهربائية. من إصلاح الأعطال البسيطة إلى فحص الأجهزة بعد النقل. فريقنا مدرب على التعامل مع جميع أنواع الأعطال.'
        }
      ],
      keywords: ['نقل ثلاجات الرياض', 'نقل غسالات', 'فك أجهزة كهربائية', 'تركيب أجهزة', 'صيانة أجهزة', 'نقل آمن', 'فريق متخصص', 'معدات حديثة']
    },
    'furniture-packing': {
      title: 'تغليف العفش',
      icon: 'fas fa-box-open',
      description: 'خدمة تغليف عفش احترافية باستخدام أفضل المواد لحماية الأثاث أثناء النقل.',
      features: [
        'تغليف أثاث كامل',
        'مواد تغليف عالية الجودة',
        'حماية من الخدوش والكسر',
        'فريق مدرب ومحترف',
        'تغليف خاص للأجهزة الكهربائية',
        'تغليف مراتب وستائر وسجاد',
      ],
      pricing: 'أسعار تغليف العفش تبدأ من 150 ريال للغرفة الواحدة.',
      articles: [
        {
          title: 'لماذا يعتبر تغليف العفش خطوة أساسية قبل النقل؟',
          content: 'تغليف العفش يحمي أثاثك من الخدوش والكسر أثناء النقل. استخدام مواد تغليف قوية يقلل من مخاطر التلف ويوفر عليك تكاليف الإصلاح أو الاستبدال. فريقنا يستخدم أفضل أنواع الكرتون والبلاستيك الفقاعي لحماية كل قطعة.'
        },
        {
          title: 'أفضل النصائح لتغليف الأثاث بنفسك',
          content: '1. استخدم كراتين قوية ومقاسات مناسبة لكل قطعة.\n2. لف الزوايا بالبلاستيك الفقاعي.\n3. ضع قطع القماش أو البطاطين بين الأثاث لمنع الاحتكاك.\n4. اكتب على كل كرتونة محتواها لتسهيل التفريغ.'
        },
        {
          title: 'أنواع مواد التغليف المستخدمة في شركتنا',
          content: 'نستخدم كرتون مضاد للصدمات، بلاستيك مطاطي، شرائط لاصقة قوية، وأكياس مخصصة للمراتب والستائر. كل مادة مختارة بعناية حسب نوع الأثاث.'
        }
      ],
      keywords: ['تغليف عفش', 'تغليف أثاث', 'مواد تغليف', 'حماية الأثاث', 'تغليف احترافي']
    }
  };



  // دالة تبديل التابات
  function switchTab(tabName) {
    console.log('Switching to tab:', tabName); // للتأكد من استدعاء الدالة
    
    // إخفاء جميع المحتويات
    document.querySelectorAll('.service-tab-content').forEach(content => {
      content.style.display = 'none';
      content.classList.remove('active');
    });
    
    // إزالة النشاط من جميع التابات
    document.querySelectorAll('.service-tab').forEach(tab => {
      tab.classList.remove('active', 'text-[#7B8C6D]', 'border-[#7B8C6D]');
      tab.classList.add('text-gray-600');
    });
    
    // إظهار المحتوى المطلوب
    const targetContent = document.getElementById(`${tabName}-tab`);
    if (targetContent) {
      targetContent.style.display = 'block';
      targetContent.classList.add('active');
      console.log('Content shown for tab:', tabName);
    } else {
      console.error('Target content not found for tab:', tabName);
    }
    
    // تفعيل التاب المطلوب
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetTab) {
      targetTab.classList.add('active', 'text-[#7B8C6D]', 'border-[#7B8C6D]');
      targetTab.classList.remove('text-gray-600');
      console.log('Tab activated:', tabName);
    } else {
      console.error('Target tab not found for:', tabName);
    }
  }

  // إضافة مستمعي الأحداث للتابات
  function initializeTabs() {
    document.querySelectorAll('.service-tab').forEach(tab => {
      // إزالة المستمعين السابقين لتجنب التكرار
      tab.removeEventListener('click', tabClickHandler);
      // إضافة المستمع الجديد
      tab.addEventListener('click', tabClickHandler);
    });
  }

  // معالج النقر على التاب
  function tabClickHandler() {
    const tabName = this.getAttribute('data-tab');
    console.log('Tab clicked:', tabName); // للتأكد من عمل النقر
    switchTab(tabName);
    
    // إضافة تأثير بصري للتأكد من النقر
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  }

  // تهيئة التابات عند تحميل الصفحة
  document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
  });

  // تهيئة التابات عند فتح النافذة المنبثقة
  window.openServiceModal = function (serviceType) {
    console.log('Opening modal for service:', serviceType); // للتأكد من استدعاء الدالة
    const service = servicesData[serviceType];
    if (!service) return;

    // تحديث محتوى النافذة المنبثقة
    document.getElementById('service-modal-title').textContent = service.title;
    document.getElementById('service-modal-icon').innerHTML = `<i class="${service.icon}"></i>`;
    document.getElementById('service-modal-description').textContent = service.description;
    
    // تحديث المميزات
    const featuresList = document.getElementById('service-modal-features-list');
    featuresList.innerHTML = service.features.map(feature => 
      `<li class="flex items-start gap-3"><i class="fas fa-check text-green-500 mt-1 text-lg"></i><span class="text-lg">${feature}</span></li>`
    ).join('');
    
    // تحديث الأسعار
    document.getElementById('service-modal-pricing-text').innerHTML = `
      <div class="space-y-4">
        <p class="text-lg">${service.pricing}</p>
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <h4 class="font-semibold text-[#7B8C6D] mb-2">ما يشمل السعر:</h4>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-center gap-2"><i class="fas fa-check text-green-500"></i>الخدمة الأساسية</li>
            <li class="flex items-center gap-2"><i class="fas fa-check text-green-500"></i>المواد والمعدات</li>
            <li class="flex items-center gap-2"><i class="fas fa-check text-green-500"></i>فريق العمل المحترف</li>
          </ul>
        </div>
      </div>
    `;
    
    // تحديث المقالات بشكل نصي بسيط
    const articlesList = document.getElementById('service-modal-articles-list');
    if (service.articles && Array.isArray(service.articles) && service.articles.length > 0) {
      articlesList.innerHTML = `
        <div style="margin-bottom: 2rem; text-align: center;">
          <h3 style="font-size: 1.5rem; font-weight: bold; color: #444; margin-bottom: 1rem;">مقالات عن ${service.title}</h3>
        </div>
        <div>
          ${service.articles.map(article => `
            <div style="margin-bottom: 2.5rem;">
              <h4 style="font-size: 1.15rem; font-weight: bold; color: #222; margin-bottom: 0.5rem;">${article.title}</h4>
              <div style="color: #444; font-size: 1rem; line-height: 1.8; white-space: pre-line;">${article.content}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      articlesList.innerHTML = `
        <div style="text-align:center; padding: 3rem 0;">
          <h4 style="font-size: 1.2rem; color: #7B8C6D; font-weight: bold; margin-bottom: 1rem;">لا توجد مقالات حالياً</h4>
          <p style="color: #888;">تابعنا لاحقاً لمزيد من المعلومات والنصائح.</p>
        </div>
      `;
    }
    
    // تحديث الكلمات المفتاحية
    const keywordsList = document.getElementById('service-modal-keywords-list');
    if (service.keywords) {
      keywordsList.innerHTML = service.keywords.map(keyword => 
        `<span class="bg-[#7B8C6D] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#657458] transition cursor-pointer">${keyword}</span>`
      ).join('');
    }
    
    // عرض النافذة المنبثقة
    serviceModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // إعادة تعيين التاب النشط
    switchTab('overview');
    
    // إعادة تهيئة التابات بعد عرض النافذة المنبثقة
    setTimeout(() => {
      initializeTabs();
      console.log('Tabs initialized after modal open'); // للتأكد من تهيئة التابات
    }, 100);
  };

  // إغلاق النافذة المنبثقة
  if (closeServiceModal) {
    closeServiceModal.addEventListener('click', function () {
      serviceModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // إغلاق النافذة المنبثقة عند النقر خارجها
  if (serviceModal) {
    serviceModal.addEventListener('click', function (e) {
      if (e.target === serviceModal) {
        serviceModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // إغلاق النافذة المنبثقة بمفتاح ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && serviceModal.style.display === 'flex') {
      serviceModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});
