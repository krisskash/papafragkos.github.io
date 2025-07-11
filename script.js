// Mobile Navigation Toggle with Glass Effect
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

// Check if mobile navigation elements exist
const mobileNavExists = navToggle !== null && navMenu !== null;

// Hide/Show Navigation on Scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.glass-nav');
const scrollThreshold = 100; // Only hide after scrolling 100px

console.log('Navigation element found:', navbar);
console.log('Initial navbar classes:', navbar ? navbar.className : 'No navbar found');

// Initialize navbar as visible
if (navbar) {
    navbar.classList.add('nav-visible');
    console.log('Added nav-visible class on load');
}

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    console.log('Scroll position:', scrollTop, 'Threshold:', scrollThreshold, 'Last scroll:', lastScrollTop);
    
    // Only trigger after scrolling past threshold
    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down - hide navbar
            console.log('SCROLLING DOWN - HIDING NAVBAR');
            navbar.classList.add('nav-hidden');
            navbar.classList.remove('nav-visible');
            console.log('After hiding - classes:', navbar.className);
        } else {
            // Scrolling up - show navbar
            console.log('SCROLLING UP - SHOWING NAVBAR');
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
            console.log('After showing - classes:', navbar.className);
        }
    } else {
        // At top of page - always show navbar
        console.log('AT TOP - SHOWING NAVBAR');
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
        console.log('At top - classes:', navbar.className);
    }
    
    lastScrollTop = scrollTop;
});

if (mobileNavExists && navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileNavExists) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close mobile menu when clicking on overlay
navOverlay.addEventListener('click', () => {
    if (mobileNavExists) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNavExists) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Enhanced navigation links - improved scroll positioning
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Show navbar when clicking nav links
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
            
            // Calculate position to center the section in viewport
            const windowHeight = window.innerHeight;
            const targetHeight = target.offsetHeight;
            const navHeight = document.querySelector('.glass-nav').offsetHeight;
            
            // Center the section: section top - (viewport height - section height) / 2
            const centerOffset = (windowHeight - targetHeight) / 2;
            
            // Special case for home section - scroll to top
            let targetPosition;
            if (targetId === '#home') {
                targetPosition = 0;
            } else {
                // For other sections, center them in the viewport
                targetPosition = target.offsetTop - centerOffset;
                
                // Ensure we don't scroll too high (respect navbar)
                targetPosition = Math.max(target.offsetTop - navHeight - 20, targetPosition);
            }
            
            // Smooth scroll to target
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to navigation links and handle navbar visibility
let scrollTimeout;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Navigation bar hide/show logic
    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down - hide navbar
            navbar.classList.add('nav-hidden');
            navbar.classList.remove('nav-visible');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
        }
    } else {
        // At top of page - always show navbar
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
    }
    
    lastScrollTop = scrollTop;
    
    // Debounce scroll events to prevent rapid state changes for active links
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Improved detection with better offset calculation
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        // Default to 'home' if at the top of the page or no section detected
        if (pageYOffset < 200 || !current) {
            current = 'home';
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + current) {
                if (!link.classList.contains('active')) {
                    link.classList.add('active');
                }
            } else {
                if (link.classList.contains('active')) {
                    link.classList.remove('active');
                }
            }
        });
    }, 50); // 50ms debounce
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add some interactivity to skill items
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Simple typing effect for hero title (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment the lines below if you want a typing effect for the hero title
// document.addEventListener('DOMContentLoaded', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 100);
// });

// Simple scroll-to-top functionality
const scrollToTop = () => {
    window.scrollTo(0, 0);
};

// Create scroll-to-top button
const createScrollToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    button.addEventListener('click', scrollToTop);
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';            button.style.visibility = 'hidden';
        }
    });
};

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main script loaded');
    
    // Initialize animations
    const animatedElements = document.querySelectorAll('.project-card, .skill-item, .about-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Set initial active state for home link
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink && window.pageYOffset < 200) {
        homeLink.classList.add('active');
    }

    // Initialize scroll-to-top button
    createScrollToTopButton();
    
    console.log('Main script initialization complete');
});
