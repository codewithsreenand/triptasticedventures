document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Intro Screen Logic
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        setTimeout(() => {
            introScreen.style.opacity = '0';
            introScreen.style.visibility = 'hidden';
        }, 3500); // Intro lasts 3.5 seconds
    }

    // Multi-Language Title Logic (Glitch Effect)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const languages = [
            "Triptastic Edventures", // English
            "ട്രിപ്റ്റാസ്റ്റിക് എഡ്വെഞ്ചേഴ്സ്", // Malayalam
            "ट्रिपटास्टिक एडवेंचर्स" // Hindi
        ];
        let langIdx = 0;

        setTimeout(() => {
            setInterval(() => {
                heroTitle.classList.add('glitching');
                
                setTimeout(() => {
                    langIdx = (langIdx + 1) % languages.length;
                    heroTitle.textContent = languages[langIdx];
                    heroTitle.setAttribute('data-text', languages[langIdx]);
                }, 200);

                setTimeout(() => {
                    heroTitle.classList.remove('glitching');
                }, 500);
            }, 3500);
        }, 3500);
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.fade-up');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // Add scroll animation class to sections dynamically
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-up');
        observer.observe(section);
    });

    // Video Sound Logic
    const soundBtn = document.getElementById('sound-btn');
    const bgVideo = document.getElementById('bg-video'); // redefined here but fine since using const at top level for rest of code
    const soundIcon = soundBtn.querySelector('i');
    let isMuted = true;

    // Optional background video alternation
    const videos = ['videos/rajasthan.mp4', 'videos/tajmahal.mp4'];
    let currentVideoIdx = 0;

    bgVideo.addEventListener('ended', () => {
        currentVideoIdx = (currentVideoIdx + 1) % videos.length;
        bgVideo.querySelector('source').src = videos[currentVideoIdx];
        bgVideo.load();
        bgVideo.play();
    });

    soundBtn.addEventListener('click', () => {
        if (isMuted) {
            bgVideo.muted = false;
            soundIcon.classList.remove('fa-volume-mute');
            soundIcon.classList.add('fa-volume-up');
        } else {
            bgVideo.muted = true;
            soundIcon.classList.remove('fa-volume-up');
            soundIcon.classList.add('fa-volume-mute');
        }
        isMuted = !isMuted;
    });

    // Mute video if scrolling away from home section
    window.addEventListener('scroll', () => {
        const homeSection = document.getElementById('home');
        const rect = homeSection.getBoundingClientRect();
        if (rect.bottom < 0 && !isMuted) {
            // Scrolled past home section
            bgVideo.muted = true;
            soundIcon.classList.remove('fa-volume-up');
            soundIcon.classList.add('fa-volume-mute');
            isMuted = true;
        }
    });
});
