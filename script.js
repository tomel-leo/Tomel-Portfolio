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
});

// Fade-in Animation on Scroll (like Gentry's site)
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
    }
  });
}, observerOptions);

// Apply fade-in to elements
document.addEventListener('DOMContentLoaded', function() {
  // Fade in interest cards
  const cards = document.querySelectorAll('.interest-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    card.classList.add('fade-in-element');
    fadeInObserver.observe(card);
  });

  // Fade in contact form
  const contactForm = document.querySelector('.contact-form-wrapper');
  if (contactForm) {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(30px)';
    contactForm.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';
    contactForm.classList.add('fade-in-element');
    fadeInObserver.observe(contactForm);
  }

  // Fade in contact info
  const contactInfo = document.querySelector('.contact-info');
  if (contactInfo) {
    contactInfo.style.opacity = '0';
    contactInfo.style.transform = 'translateY(30px)';
    contactInfo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    contactInfo.classList.add('fade-in-element');
    fadeInObserver.observe(contactInfo);
  }
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

// Form Validation
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
      alert('Please fill in all fields.');
      return false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      e.preventDefault();
      alert('Please enter a valid email address.');
      return false;
    }
  });

  // Input focus effects
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.borderColor = '#2b6cb0';
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.style.borderColor = '#e2e8f0';
      }
    });
  });
}

// Scroll to top on page load
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});
