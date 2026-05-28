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
    const bgVideo = document.getElementById('bg-video');
    const soundIcon = soundBtn.querySelector('i');
    let isMuted = true;

    // Optional background video alternation
    const videos = ['videos/rajasthan.mp4', 'videos/tajmahal.mp4'];
    let currentVideoIdx = 0;

    // Direct src assignment is much more reliable on mobile Safari/Chrome than nested source tag manipulation
    bgVideo.addEventListener('ended', () => {
        currentVideoIdx = (currentVideoIdx + 1) % videos.length;
        bgVideo.src = videos[currentVideoIdx];
        bgVideo.load();
        const playPromise = bgVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play prevented after video change: ", error);
            });
        }
    });

    // Toggle sound button logic
    soundBtn.addEventListener('click', () => {
        if (isMuted) {
            bgVideo.muted = false;
            // On mobile, if the video was blocked and paused, clicking the sound button
            // must explicitly trigger play so that it doesn't stay paused.
            const playPromise = bgVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Play failed on sound button click: ", error);
                });
            }
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
        if (homeSection) {
            const rect = homeSection.getBoundingClientRect();
            if (rect.bottom < 0 && !isMuted) {
                // Scrolled past home section
                bgVideo.muted = true;
                soundIcon.classList.remove('fa-volume-up');
                soundIcon.classList.add('fa-volume-mute');
                isMuted = true;
            }
        }
    });

    // Fallback: try to play the background video immediately, and hook up user interaction play triggers if blocked
    const attemptAutoplay = () => {
        const playPromise = bgVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay blocked. Adding fallback user interaction listeners.", error);
                
                const playOnGesture = () => {
                    const innerPlayPromise = bgVideo.play();
                    if (innerPlayPromise !== undefined) {
                        innerPlayPromise.then(() => {
                            // Successfully started video, remove triggers
                            document.removeEventListener('click', playOnGesture);
                            document.removeEventListener('touchstart', playOnGesture);
                        }).catch(err => {
                            console.log("Failed to play on user gesture: ", err);
                        });
                    }
                };
                
                document.addEventListener('click', playOnGesture);
                document.addEventListener('touchstart', playOnGesture);
            });
        }
    };
    attemptAutoplay();

    // IntersectionObserver for all videos to play/pause dynamically depending on visibility.
    // This is highly optimal for mobile performance and battery life.
    const allVideos = document.querySelectorAll('video');
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Try to play when in viewport
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Observer play blocked: ", error);
                            
                            // Try to play on interaction as fallback
                            const playOnGesture = () => {
                                video.play().then(() => {
                                    document.removeEventListener('click', playOnGesture);
                                    document.removeEventListener('touchstart', playOnGesture);
                                }).catch(err => {});
                            };
                            document.addEventListener('click', playOnGesture);
                            document.addEventListener('touchstart', playOnGesture);
                        });
                    }
                } else {
                    // Pause when scrolled out of view to save battery and data
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        allVideos.forEach(video => videoObserver.observe(video));
    }

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Toggle current FAQ item
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });
});

