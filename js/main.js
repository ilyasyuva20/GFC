(function () {
  if (window.__gfcMainJsInitialized) {
    console.log("GFC Main JS already initialized. Skipping duplicate execution.");
    return;
  }
  window.__gfcMainJsInitialized = true;

  function init() {

    // Helper to resolve asset paths locally vs WordPress custom-assets
    function getAssetPath(path) {
      if (!path) return '';
      if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return path.replace(/^\/?custom-assets\//, '');
      }
      return path;
    }

    // ==========================================
    // 1. STICKY NAVBAR CONTROLLER
    // ==========================================
    const navbar = document.querySelector('.navbar-custom');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function () {
      console.log('Scroll event fired! scrollY:', window.scrollY);
      if (navbar) {
        if (window.scrollY > 80) {
          navbar.classList.add('sticky');
        } else {
          navbar.classList.remove('sticky');
        }
      }

      // Back to top button visibility
      if (backToTop) {
        if (window.scrollY > 500) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      }
    });

    // Back to top click behavior
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const bsCollapse = navbarCollapse ? bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false }) : null;

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992 && bsCollapse) {
          bsCollapse.hide();
        }
      });
    });

    // ==========================================
    // 2. HERO & REVIEWS CAROUSELS (SWIPER)
    // ==========================================
    // Initialize Hero Swiper
    const heroSwiper = new Swiper('.hero-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    // Initialize Reviews Swiper (3-per-view matching screenshot)
    const reviewsSwiper = new Swiper('.reviews-swiper', {
      loop: true,
      spaceBetween: 16,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      }
    });

    // Wire custom prev/next buttons in Google rating badge
    const revPrevBtn = document.querySelector('.rev-prev-btn');
    const revNextBtn = document.querySelector('.rev-next-btn');
    if (revPrevBtn) revPrevBtn.addEventListener('click', () => reviewsSwiper.slidePrev());
    if (revNextBtn) revNextBtn.addEventListener('click', () => reviewsSwiper.slideNext());

    // Initialize Why Choose Us Swiper
    const whyChooseSwiper = new Swiper('.why-choose-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.why-choose-swiper-pagination',
        clickable: true,
      },
    });

    // ==========================================
    // 3. STATS COUNTING ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; // The lower the slower

    const formatNumber = (num, suffix = '') => {
      return num.toLocaleString() + suffix;
    };

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target')) || 0;
      const suffix = counter.getAttribute('data-suffix') || '';

      if (!counter.hasOwnProperty('rawCount')) {
        counter.rawCount = 0;
      }

      const increment = Math.ceil(target / speed) || 1;

      if (counter.rawCount < target) {
        counter.rawCount = Math.min(counter.rawCount + increment, target);
        counter.innerText = formatNumber(counter.rawCount, suffix);
        setTimeout(() => animateCounter(counter), 10);
      } else {
        counter.innerText = formatNumber(target, suffix);
      }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          animateCounter(counter);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      let target = parseInt(counter.getAttribute('data-target'));
      let suffix = counter.getAttribute('data-suffix') || '';
      if (isNaN(target)) {
        const text = counter.innerText.trim();
        target = parseInt(text.replace(/[^0-9]/g, '')) || 0;
        suffix = text.replace(/[0-9,]/g, '');
        counter.setAttribute('data-target', target);
        counter.setAttribute('data-suffix', suffix);
      }
      counter.innerText = formatNumber(0, suffix);
      counterObserver.observe(counter);
    });

    // ==========================================
    // 4. SCROLL REVEAL EFFECT
    // ==========================================
    const reveals = document.querySelectorAll('.reveal-fade-in');
    console.log('Found reveal elements count:', reveals.length);

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        console.log('Reveal entry target ID:', entry.target.id, 'Classes:', entry.target.className, 'isIntersecting:', entry.isIntersecting);
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(reveal => {
      revealObserver.observe(reveal);
    });

    // ==========================================
    // 5. INTERACTIVE BRANCH & MAP SWITCHER (Dynamic Swiper & Filters)
    // ==========================================
    const networkBranches = [
      {
        id: '1',
        name: 'GFC Auto Care Centre',
        address: 'BMW Road, Industrial Area 2, ADNOC 582, Sharjah, UAE',
        shortAddress: 'BMW Road, Industrial Area 2, ADNOC 582',
        hours: '9:00 AM - 11:00 PM',
        distance: '1.2 km away',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.311394334305!2d55.4057865!3d25.3273656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5be4df477969%3A0xc3d8c83a5e884e9e!2sADNOC%20Service%20Station%20%7C%20Green%20Belt%20(582)!5e0!3m2!1sen!2sae!4v1717900000000!5m2!1sen!2sae',
        directionUrl: 'https://maps.app.goo.gl/wS3x8b9tYw8U9rL2A',
        image: '/custom-assets/images/branch-1.png',
        services: ['interior-upholstery', 'ppf-detailing', 'tires-alignment', 'mechanical-care', 'car-wash']
      },
      {
        id: '2',
        name: 'Minerva Service Centre',
        address: 'Muteena, Sharjah, ADNOC 181, Near Kuwait Hospital, Sharjah, UAE',
        shortAddress: 'Muteena, Sharjah, ADNOC 181',
        hours: '8:00 AM - 10:00 PM',
        distance: '3.8 km away',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.979069502693!2d55.400494!3d25.338573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5bc08b98b98b%3A0x0!2sADNOC%20Petrol%20Station%20Al%20Muteena!5e0!3m2!1sen!2sae!4v1717900000000!5m2!1sen!2sae',
        directionUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.338573,55.400494',
        image: '/custom-assets/images/branch-2.png',
        services: ['ppf-detailing', 'tires-alignment', 'mechanical-care']
      },
      {
        id: '3',
        name: 'ADNOC Ghafiya (184)',
        address: 'Ghafiya, Near Ghafiya Park, Sharjah, UAE',
        shortAddress: 'Ghafiya, Sharjah, UAE',
        hours: '9:00 AM - 12:00 AM',
        distance: '5.4 km away',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.419139828475!2d55.420371!3d25.357361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f590d98473c9f%3A0x2db475fb1737e4fb!2sAl%20Ghafiya%20Park!5e0!3m2!1sen!2sae!4v1717900000000!5m2!1sen!2sae',
        directionUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.357361,55.420371',
        image: '/custom-assets/images/branch-3.png',
        services: ['tires-alignment', 'mechanical-care', 'car-wash']
      },
      {
        id: '4',
        name: 'ADNOC Yarmouk (655)',
        address: 'Yarmouk, Sharjah, UAE',
        shortAddress: 'Yarmouk, Sharjah',
        hours: '8:00 AM - 11:00 PM',
        distance: '7.1 km away',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.123512398412!2d55.405374!3d25.334123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5bc2f1db9cbb%3A0xd6c4b27ff7efc4aa!2sAl%20Yarmook%2C%20Sharjah!5e0!3m2!1sen!2sae!4v1717900000000!5m2!1sen!2sae',
        directionUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.334123,55.405374',
        image: '/custom-assets/images/branch-4.png',
        services: ['interior-upholstery', 'ppf-detailing', 'car-wash']
      },
      {
        id: '5',
        name: 'FASTTRACK Car Wash',
        address: 'Mirgab, Sharjah — ADNOC 584, UAE',
        shortAddress: 'Mirgab, Sharjah — ADNOC 584',
        hours: '8:00 AM - 12:00 AM',
        distance: '9.2 km away',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.34124982138!2d55.412384!3d25.359871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f59fa4fef5a1f%3A0x6b772c6ab83b8b0e!2sAl%20Mirgab%2C%20Sharjah!5e0!3m2!1sen!2sae!4v1717900000000!5m2!1sen!2sae',
        directionUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.359871,55.412384',
        image: '/custom-assets/images/branch-5.png',
        services: ['car-wash', 'ppf-detailing']
      }
    ];

    const bespokeCardHtml = `
    <div class="swiper-slide">
      <div class="outlet-card bespoke-card" style="cursor: default;">
        <div class="outlet-card-content d-flex flex-column justify-content-between h-100">
          <div>
            <span class="badge-bespoke">BESPOKE</span>
          </div>
          <div class="mb-3">
            <h4 class="bespoke-title text-white mb-2">GFC DIRECT<br>AT YOUR LOCATION</h4>
            <p class="bespoke-desc mb-0">Our professional crew can visit your home/office in Dubai & Sharjah to install high quality leather upholstery or perform auto detailing.</p>
          </div>
          <div>
            <a href="https://wa.me/971547448161?text=Hi%20GFC%20Direct,%20I%20am%20interested%20in%20a%20mobile%20detailing/upholstery%20service." target="_blank" class="btn btn-red w-100 py-2 text-center d-flex justify-content-center align-items-center gap-2" style="font-size: 11px;">
              <i class="fab fa-whatsapp"></i> REQUEST CREW
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

    // Initialize Network Swiper
    const networkSwiper = new Swiper('.network-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.network-swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });

    const swiperWrapper = document.getElementById('network-swiper-wrapper');
    const filterButtons = document.querySelectorAll('.btn-filter');

    // Element references for detail view
    const mapIframe = document.getElementById('network-map-iframe');
    const openInMapsBtn = document.getElementById('open-in-maps-btn');
    const detailTitle = document.getElementById('selected-branch-title');
    const detailAddress = document.getElementById('selected-branch-address');
    const detailDirections = document.getElementById('selected-branch-directions');
    const detailBook = document.getElementById('selected-branch-book');

    // Update selected branch details in map/info section
    function updateBranchDetails(branch) {
      if (!branch) return;

      // Smooth transition fade-out/in
      if (mapIframe) {
        mapIframe.style.opacity = '0.3';
        setTimeout(() => {
          mapIframe.src = branch.mapUrl;
          mapIframe.onload = () => {
            mapIframe.style.opacity = '1';
          };
        }, 200);
      }

      if (openInMapsBtn) openInMapsBtn.href = branch.directionUrl;
      if (detailTitle) detailTitle.textContent = branch.name;
      if (detailAddress) detailAddress.textContent = branch.address;
      if (detailDirections) detailDirections.href = branch.directionUrl;

      if (detailBook) {
        const waMessage = `Hi GFC, I'd like to book a service at ${branch.name}.`;
        detailBook.href = `https://wa.me/971547448161?text=${encodeURIComponent(waMessage)}`;
      }
    }

    // Filter and render slides
    function filterOutlets(filterValue) {
      // Empty wrapper
      swiperWrapper.innerHTML = '';

      // Filter branch array
      const filtered = networkBranches.filter(b => {
        return filterValue === 'all' || b.services.includes(filterValue);
      });

      // Build slides HTML
      let slidesHtml = '';
      filtered.forEach((branch, index) => {
        const isActive = index === 0 ? 'active' : '';
        const numStr = String(networkBranches.indexOf(branch) + 1).padStart(2, '0');
        slidesHtml += `
        <div class="swiper-slide">
          <div class="outlet-card ${isActive}" data-id="${branch.id}" style="background-image: url('${getAssetPath(branch.image)}');">
            <div class="outlet-card-overlay"></div>
            <div class="outlet-card-content">
              <div class="d-flex justify-content-between align-items-start">
                <span class="badge-city">SHARJAH</span>
                <span class="badge-status">OPEN</span>
              </div>
              <div>
                <div class="mb-2 d-flex align-items-baseline">
                  <span class="outlet-number">${numStr}</span>
                  <h4 class="outlet-name">${branch.name}</h4>
                </div>
                <div class="outlet-info-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${branch.shortAddress}</span>
                </div>
                <div class="outlet-info-item">
                  <i class="fas fa-clock"></i>
                  <span>${branch.hours}</span>
                </div>
                <div class="outlet-info-item text-highlight">
                  <i class="fas fa-route"></i>
                  <span>${branch.distance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      });

      // Add bespoke card for certain filters
      if (filterValue === 'all' || filterValue === 'interior-upholstery' || filterValue === 'ppf-detailing') {
        slidesHtml += bespokeCardHtml;
      }

      swiperWrapper.innerHTML = slidesHtml;

      // Update swiper structure
      networkSwiper.update();
      networkSwiper.slideTo(0);

      // Set initial details
      if (filtered.length > 0) {
        updateBranchDetails(filtered[0]);
      }
    }

    // Set up click handlers on dynamically loaded outlet cards
    swiperWrapper.addEventListener('click', function (e) {
      const card = e.target.closest('.outlet-card:not(.bespoke-card)');
      if (!card) return;

      // Remove active class from all
      document.querySelectorAll('.outlet-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const id = card.getAttribute('data-id');
      const branch = networkBranches.find(b => b.id === id);
      updateBranchDetails(branch);
    });

    // Filter button event listeners
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');
        filterOutlets(filterValue);
      });
    });

    // Run initial load (all)
    filterOutlets('all');

    // ==========================================
    // 6. BEFORE & AFTER COMPARISON SLIDERS
    // ==========================================
    function initBASlider(slider) {
      const beforeEl = slider.querySelector('.ba-before');
      const handle = slider.querySelector('.ba-handle');
      let isDragging = false;

      function setPosition(x) {
        const rect = slider.getBoundingClientRect();
        let pct = (x - rect.left) / rect.width;
        pct = Math.min(Math.max(pct, 0.02), 0.98);
        const pctPx = (pct * 100).toFixed(2) + '%';
        beforeEl.style.width = pctPx;
        handle.style.left = pctPx;
      }

      // Mouse
      handle.addEventListener('mousedown', () => { isDragging = true; });
      slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        setPosition(e.clientX);
      });
      window.addEventListener('mousemove', (e) => {
        if (isDragging) setPosition(e.clientX);
      });
      window.addEventListener('mouseup', () => { isDragging = false; });

      // Touch
      handle.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, { passive: false });
      slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        setPosition(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (isDragging) setPosition(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchend', () => { isDragging = false; });
    }

    document.querySelectorAll('.ba-slider').forEach(initBASlider);

    // ==========================================
    // 7. BEFORE & AFTER TAB SWITCHER
    // ==========================================
    const baTabs = document.querySelectorAll('.ba-tab');
    const baContent = document.querySelectorAll('.ba-content');

    baTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        baTabs.forEach(t => t.classList.remove('active'));
        baContent.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        const panel = document.getElementById('ba-' + target);
        if (panel) panel.classList.add('active');
      });
    });

    // ==========================================
    // 8. FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        // Open clicked (if it was closed)
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
