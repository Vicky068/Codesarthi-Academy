/* 
================================================================
   CODESARTHI ACADEMY - VANILLA JAVASCRIPT LOGIC
   Fully interactive, fast, and dependency-free.
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STICKY NAVBAR & BACK TO TOP BUTTON
  // ==========================================
  const header = document.querySelector('.header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    // Sticky header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Back to top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==========================================
  // 2. MOBILE NAVIGATION HAMBURGER MENU
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }


  // ==========================================
  // 3. PAGE-AWARE ACTIVE NAVIGATION HIGHLIGHTING
  // ==========================================
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop();

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    // Highlight home for root or index.html
    if (currentPage === '' || currentPage === 'index.html') {
      if (href === 'index.html' || href === '#home') {
        link.classList.add('active');
      }
    } else {
      // Highlight matching page
      if (href === currentPage || href.startsWith(currentPage)) {
        link.classList.add('active');
      }
    }
  });


  // ==========================================
  // Smooth Scroll Click Interceptor for Cross-Page Links
  // ==========================================
  const allLinks = document.querySelectorAll('a[href]');
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes('#')) {
      const parts = href.split('#');
      const pageTarget = parts[0];
      const hashTarget = '#' + parts[1];
      
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      
      // Determine if the target page is the current page
      let isCurrentPage = false;
      if (pageTarget === '' || pageTarget === 'index.html') {
        isCurrentPage = (currentFile === '' || currentFile === 'index.html');
      } else {
        isCurrentPage = (currentFile === pageTarget);
      }
      
      if (isCurrentPage) {
        link.addEventListener('click', (e) => {
          const targetEl = document.querySelector(hashTarget);
          if (targetEl) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (hamburger && hamburger.classList.contains('open')) {
              hamburger.classList.remove('open');
              if (navMenu) navMenu.classList.remove('open');
            }
            
            targetEl.scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      }
    }
  });


  // ==========================================
  // 4. ANIMATED COUNTERS
  // ==========================================
  const counterItems = document.querySelectorAll('.stat-number');
  
  if (counterItems.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds total animation
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutQuad)
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        el.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    };

    const counterObserverOptions = {
      root: null,
      threshold: 0.2
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, counterObserverOptions);

    counterItems.forEach(item => {
      counterObserver.observe(item);
    });
  }


  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, revealObserverOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }


  // ==========================================
  // 6. TESTIMONIALS SLIDER
  // ==========================================
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (track && slides.length > 0 && dotsContainer) {
    let currentIndex = 0;
    let autoPlayInterval;

    // Reset dots in case of double scripts
    dotsContainer.innerHTML = '';

    // Create Navigation Dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateSlider();
      resetAutoPlay();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    };

    // Button Listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Auto Play
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    // Pause on hover
    const carouselArea = document.querySelector('.testimonial-carousel');
    if (carouselArea) {
      carouselArea.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      carouselArea.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();
  }


  // ==========================================
  // 7. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      // Toggle current FAQ item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });


  // ==========================================
  // 8. FORM VALIDATIONS
  // ==========================================
  const successOverlay = document.getElementById('successOverlay');
  const closeSuccessBtn = document.getElementById('closeSuccess');
  
  // A. Demo Registration Form
  const demoForm = document.getElementById('demoForm');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const formFields = ['name', 'email', 'phone', 'college', 'course'];

      formFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;
        const formGroup = input.closest('.form-group');
        let fieldValid = true;

        formGroup.classList.remove('error');

        if (input.value.trim() === '') {
          fieldValid = false;
          const errorEl = formGroup.querySelector('.error-msg');
          errorEl.textContent = 'This field is required';
        } else {
          if (fieldId === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
              fieldValid = false;
              const errorEl = formGroup.querySelector('.error-msg');
              errorEl.textContent = 'Please enter a valid email address';
            }
          } else if (fieldId === 'phone') {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(input.value.trim())) {
              fieldValid = false;
              const errorEl = formGroup.querySelector('.error-msg');
              errorEl.textContent = 'Please enter a valid 10-digit phone number';
            }
          }
        }

        if (!fieldValid) {
          formGroup.classList.add('error');
          isValid = false;
        }
      });

      if (isValid) {
        if (successOverlay) {
          // Customize success text for demo
          const successTitle = successOverlay.querySelector('.success-title');
          const successText = successOverlay.querySelector('.success-text');
          if (successTitle) successTitle.textContent = 'Registration Successful!';
          if (successText) successText.textContent = 'Thank you for registering for the free demo class. Our counselor will contact you within 24 hours.';
          successOverlay.classList.add('show');
        }
        demoForm.reset();
      }
    });
  }

  // B. Free Summer/Winter Training Form
  const trainingForm = document.getElementById('trainingForm');
  if (trainingForm) {
    trainingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const formFields = ['training-name', 'training-email', 'training-phone', 'training-college', 'training-cohort', 'training-semester'];

      formFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;
        const formGroup = input.closest('.form-group');
        let fieldValid = true;

        formGroup.classList.remove('error');

        if (input.value.trim() === '') {
          fieldValid = false;
          const errorEl = formGroup.querySelector('.error-msg');
          errorEl.textContent = 'This field is required';
        } else {
          if (fieldId === 'training-email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
              fieldValid = false;
              const errorEl = formGroup.querySelector('.error-msg');
              errorEl.textContent = 'Please enter a valid email address';
            }
          } else if (fieldId === 'training-phone') {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(input.value.trim())) {
              fieldValid = false;
              const errorEl = formGroup.querySelector('.error-msg');
              errorEl.textContent = 'Please enter a valid 10-digit phone number';
            }
          }
        }

        if (!fieldValid) {
          formGroup.classList.add('error');
          isValid = false;
        }
      });

      if (isValid) {
        if (successOverlay) {
          // Customize success text for training
          const successTitle = successOverlay.querySelector('.success-title');
          const successText = successOverlay.querySelector('.success-text');
          if (successTitle) successTitle.textContent = 'Application Submitted!';
          if (successText) successText.textContent = 'Your application for the free training program has been received. Our team will review your eligibility and reach out to you.';
          successOverlay.classList.add('show');
        }
        trainingForm.reset();
      }
    });
  }

  // Close Success Modal
  if (closeSuccessBtn && successOverlay) {
    closeSuccessBtn.addEventListener('click', () => {
      successOverlay.classList.remove('show');
    });

    successOverlay.addEventListener('click', (e) => {
      if (e.target === successOverlay) {
        successOverlay.classList.remove('show');
      }
    });
  }

});
