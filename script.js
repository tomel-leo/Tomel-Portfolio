// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu after clicking
      document.getElementById('menu-toggle').checked = false;
    }
  });
});

// Mobile Menu - Close when clicking outside
document.addEventListener('click', function(e) {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.querySelector('.navbar');
  
  if (!navbar.contains(e.target) && menuToggle.checked) {
    menuToggle.checked = false;
  }
});

// Active Navigation Highlighting on Scroll
window.addEventListener('scroll', function() {
  let current = '';
  const sections = document.querySelectorAll('section[id]');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Header shadow on scroll
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
  }
});

// Fade-in Animation on Scroll (Gentry Style)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -80px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
    }
  });
}, observerOptions);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Fade in interest cards with stagger
  const interestCards = document.querySelectorAll('.interest-card');
  interestCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    card.classList.add('fade-in-element');
    fadeInObserver.observe(card);
  });

  // Fade in project cards with stagger
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    card.classList.add('fade-in-element');
    fadeInObserver.observe(card);
  });

  // Fade in about content
  const aboutContent = document.querySelector('.about-content');
  if (aboutContent) {
    aboutContent.style.opacity = '0';
    aboutContent.style.transform = 'translateY(40px)';
    aboutContent.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    aboutContent.classList.add('fade-in-element');
    fadeInObserver.observe(aboutContent);
  }

  // Fade in contact form
  const contactForm = document.querySelector('.contact-form-wrapper');
  if (contactForm) {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(40px)';
    contactForm.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
    contactForm.classList.add('fade-in-element');
    fadeInObserver.observe(contactForm);
  }

  // Fade in contact info cards
  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    card.classList.add('fade-in-element');
    fadeInObserver.observe(card);
  });
});

// Add visible class when element is in view
const style = document.createElement('style');
style.textContent = `
  .fade-in-element.fade-in-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// Testimonials Slider - Pause on Hover (Gentry Style)
const testimonialTrack = document.querySelector('.testimonial-track');
if (testimonialTrack) {
  // Clone testimonials for infinite loop
  const testimonials = Array.from(testimonialTrack.children);
  testimonials.forEach(testimonial => {
    const clone = testimonial.cloneNode(true);
    testimonialTrack.appendChild(clone);
  });

  // Pause/Resume on hover and tap
  testimonialTrack.addEventListener('mouseenter', function() {
    this.style.animationPlayState = 'paused';
  });

  testimonialTrack.addEventListener('mouseleave', function() {
    this.style.animationPlayState = 'running';
  });

  // Touch support for mobile
  let touchPaused = false;
  testimonialTrack.addEventListener('touchstart', function() {
    touchPaused = !touchPaused;
    this.style.animationPlayState = touchPaused ? 'paused' : 'running';
  });
}

// Form Validation with Better UX
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    const name = this.querySelector('input[name="name"]');
    const email = this.querySelector('input[name="email"]');
    const subject = this.querySelector('input[name="subject"]');
    const message = this.querySelector('textarea[name="message"]');

    // Validate all fields are filled
    if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
      e.preventDefault();
      alert('Please fill in all fields before submitting.');
      return false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      e.preventDefault();
      alert('Please enter a valid email address.');
      return false;
    }

    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
  });

  // Input focus effects with smooth transitions
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.borderColor = '#2b6cb0';
      this.style.boxShadow = '0 0 0 3px rgba(43, 108, 176, 0.1)';
    });
    
    input.addEventListener('blur', function() {
      this.style.borderColor = '#e2e8f0';
      this.style.boxShadow = 'none';
    });
  });
}

// Smooth Page Load
window.addEventListener('load', function() {
  document.body.style.opacity = '1';
});

// Scroll to top on page load
window.scrollTo(0, 0);
const body = document.body;
const toggle = document.getElementById('darkModeToggle');

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  toggle.textContent = '☀️';
}

toggle.addEventListener('click', function() {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    toggle.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    toggle.textContent = '🌙';
  }
});

