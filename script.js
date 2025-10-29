// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.checked = false;
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const navbar = document.querySelector('.navbar');
  if (!navbar.contains(e.target) && menuToggle.checked) {
    menuToggle.checked = false;
  }
});

// Smooth Scroll for Navigation Links
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
    }
  });
});

// Active Navigation on Scroll (like Gentry's site)
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-menu a');

function setActiveNav() {
  let scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${sectionId}`) {
          item.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveNav);

// Header Shadow on Scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
  }
});

// Form Validation (Enhanced)
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const name = this.querySelector('input[name="name"]').value.trim();
    const email = this.querySelector('input[name="email"]').value.trim();
    const subject = this.querySelector('input[name="subject"]').value.trim();
    const message = this.querySelector('textarea[name="message"]').value.trim();

    if (!name || !email || !subject || !message) {
      e.preventDefault();
      alert('Please fill in all fields before submitting.');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('Please enter a valid email address.');
      return false;
    }

    // If validation passes, show success message
    alert('Thank you for your message! Your email client will open to send the message.');
  });
}

// Animate Elements on Scroll (like Gentry's site)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe interest cards
const interestCards = document.querySelectorAll('.interest-card');
interestCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// Observe about content
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
  aboutContent.style.opacity = '0';
  aboutContent.style.transform = 'translateY(30px)';
  aboutContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(aboutContent);
}

// Prevent form resubmission on page reload
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// Loading Animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Console Easter Egg (like many developers do)
console.log('%cHello Developer! 👋', 'font-size: 20px; font-weight: bold; color: #2b6cb0;');
console.log('%cLooking at the code? I appreciate your curiosity!', 'font-size: 14px; color: #4a5568;');
console.log('%c- Tomel', 'font-size: 14px; font-style: italic; color: #718096;');
