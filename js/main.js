// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
});

// Lerp function for smooth ring chase
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function animateCursor() {
    if (cursorRing) {
        ringX = lerp(ringX, mouseX, 0.15);
        ringY = lerp(ringY, mouseY, 0.15);
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects on cursor
const hoverTargets = document.querySelectorAll('.hover-target, a, button');
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// Preloader & Hero Animation Sequence
function startSite() {
    const preloader = document.getElementById('preloader');
    if (!preloader || preloader.style.top === '-100%') return; // Already started
    
    preloader.style.top = '-100%';
    
    // Trigger Hero text animations
    setTimeout(() => {
        // Split text animation for title
        const titleLines = document.querySelectorAll('.hero-title span:not(.word)');
        titleLines.forEach((line, i) => {
            const words = line.innerText.split(' ');
            line.innerHTML = '';
            words.forEach((word, j) => {
                const span = document.createElement('span');
                span.classList.add('word');
                span.innerText = word + ' ';
                span.style.animation = `slideUpWord 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${(i * 2 + j) * 0.1 + 0.3}s`;
                line.appendChild(span);
            });
        });

        // Subtitle fade in
        const subtitle = document.querySelector('.hero-subtitle');
        if(subtitle) subtitle.style.animation = 'fadeInUp 1s ease forwards 0.8s';
        
        // Tagline fade in
        const tagline = document.querySelector('.hero-tagline');
        if(tagline) tagline.style.animation = 'fadeInUp 1s ease forwards 1s';
        
        // Buttons fade in
        const btns = document.querySelector('.hero-btns');
        if(btns) btns.style.animation = 'fadeInUp 1s ease forwards 1.2s';
        
    }, 800);
}

// Run on load
window.addEventListener('load', startSite);

// Safety fallback: Start after 3 seconds anyway if load event is slow
setTimeout(startSite, 3000);

// Dynamic keyframes injection for JS animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideUpWord {
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Parallax & Sticky Navbar
const navbar = document.getElementById('navbar');
const heroBg = document.getElementById('hero-bg');
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Scroll Progress Bar
    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
    
    // Navbar shrink (Triggered slightly later to account for top banner)
    if (navbar) {
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Hero Parallax (0.4x speed)
    if(heroBg) {
        heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in-view', 'in-view');
            // Stop observing once animated
            if(entry.target.classList.contains('reveal-up') || entry.target.classList.contains('reveal-clip')){
                scrollObserver.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-clip, .philosophy-img').forEach(el => {
    scrollObserver.observe(el);
});

// Pricing Tabs Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.pricing-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active to clicked
        btn.classList.add('active');
        const targetId = `tab-${btn.getAttribute('data-tab')}`;
        const targetTab = document.getElementById(targetId);
        if (targetTab) targetTab.classList.add('active');
    });
});

// Smooth Scroll with Offset for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// Hide custom cursor on touch devices
if (cursorDot && cursorRing) {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
    }
}
