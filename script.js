// Global variable to store current user email for survey
let currentUserEmail = null;

// Premium website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
    }, 800);
    
    // Handle all email forms
    const emailForms = document.querySelectorAll('.email-form');
    emailForms.forEach(form => {
        form.addEventListener('submit', handleEmailSubmit);
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effects
    initNavbarEffects();
    
    // Initialize premium interactions
    initPremiumInteractions();
});

// Initialize scroll-triggered animations
function initScrollAnimations() {
    // Only enable on desktop for performance
    if (window.innerWidth <= 768) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.problem-card, .feature').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced navbar scroll effects
function initNavbarEffects() {
    const navbar = document.querySelector('header');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Only hide navbar on mobile and when scrolling down fast
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// Premium interactions and effects
function initPremiumInteractions() {
    // Reduced parallax for performance
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.float-card');
        
        if (window.innerWidth > 1024) { // Only on desktop
            parallaxElements.forEach((el, index) => {
                const speed = 0.2 + (index * 0.05);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Subtle problem cards hover effects
    document.querySelectorAll('.problem-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) { // Only on desktop
                card.style.transform = 'translateY(-4px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Subtle phone mockup interactions
    const phoneMockup = document.querySelector('.phone-container');
    if (phoneMockup && window.innerWidth > 768) {
        phoneMockup.addEventListener('mouseenter', () => {
            phoneMockup.style.transform = 'rotateY(-8deg) rotateX(3deg) scale(1.02)';
        });
        
        phoneMockup.addEventListener('mouseleave', () => {
            phoneMockup.style.transform = 'rotateY(-5deg) rotateX(2deg) scale(1)';
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        });
    });
    
    // Update waitlist counter
    updateWaitlistCounter();
}

// Update waitlist counter (simulated)
function updateWaitlistCounter() {
    const counter = document.querySelector('.privacy-text strong');
    if (counter) {
        const stored = JSON.parse(localStorage.getItem('fokusWaitlist') || '[]');
        const baseCount = 2847;
        const currentCount = baseCount + stored.length;
        counter.textContent = `${currentCount.toLocaleString()} digital wellness enthusiasts`;
    }
}

// Handle email form submission
async function handleEmailSubmit(e) {
    e.preventDefault();
    console.log('Form submitted!'); // Debug log
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    console.log('Email:', email); // Debug log
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Joining...';
    submitButton.disabled = true;
    
    try {
        // Store email in Google Sheets
        await storeEmail(email);
        
        // Store email for survey submission
        currentUserEmail = email;
        window.currentUserEmail = email;
        
        // Clear form
        emailInput.value = '';
        
        // Track conversion (optional - integrate with your analytics)
        trackEmailSignup(email);
        
        // Show success message
        showMessage('🎉 Welcome to the foKus waitlist! Please complete our quick survey.', 'success');
        
        // Show user profile modal after successful email submission
        console.log('Email stored successfully, showing modal in 1 second...'); // Debug log
        setTimeout(() => {
            console.log('Attempting to show modal...'); // Debug log
            if (typeof window.showUserProfileModal === 'function') {
                console.log('Modal function found, opening modal...'); // Debug log
                window.showUserProfileModal();
            } else {
                console.error('showUserProfileModal function not found!'); // Debug log
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error storing email:', error);
        showMessage('Something went wrong. Please try again.', 'error');
    } finally {
        // Reset button
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Google Sheets Integration
// Connected to Google Apps Script for foKus Waitlist
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxminCfWF4HYi7xZ_BcWcL15K9AfQeLU4HoJk9QZmevQQTrX0g6jb2bMj4lp-h87tRv/exec';

// Store email in Google Sheets
async function storeEmail(email) {
    try {
        // Send email signup to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'email_signup',
                email,
                timestamp: new Date().toISOString(),
                source: window.location.pathname,
                referrer: document.referrer
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to store email');
        }
        
        // Simulate delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true };
    } catch (error) {
        console.error('Error storing email:', error);
        throw error;
    }
}

// Store survey data in Google Sheets
async function storeSurveyData(email, surveyData) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'survey_complete',
                email,
                userTypes: surveyData.userTypes || [],
                painPoints: surveyData.painPoints || [],
                usageContext: surveyData.usageContext || [],
                comments: surveyData.comments || ''
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to store survey data');
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error storing survey data:', error);
        // Don't throw error for survey - email signup already succeeded
        return { success: false };
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success/error messages
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}-message show`;
    messageEl.textContent = message;
    
    // Add styles based on type
    if (type === 'success') {
        messageEl.style.background = '#10b981';
        messageEl.style.color = 'white';
    } else if (type === 'error') {
        messageEl.style.background = '#ef4444';
        messageEl.style.color = 'white';
    }
    
    messageEl.style.padding = '1rem 1.5rem';
    messageEl.style.borderRadius = '8px';
    messageEl.style.textAlign = 'center';
    messageEl.style.marginTop = '1rem';
    messageEl.style.fontSize = '0.9rem';
    
    // Insert after the first email form
    const firstForm = document.querySelector('.email-form');
    if (firstForm) {
        firstForm.parentNode.insertBefore(messageEl, firstForm.nextSibling);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Analytics tracking (replace with your analytics service)
function trackEmailSignup(email) {
    // Google Analytics example (if you use GA)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_signup', {
            'event_category': 'engagement',
            'event_label': 'waitlist',
            'value': 1
        });
    }
    
    // Facebook Pixel example (if you use Facebook Ads)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Fokus Waitlist Signup'
        });
    }
    
    // Console log for development
    console.log('Email signup tracked:', {
        email,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
}

// Smooth scrolling for any anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('header');
    if (navbar && window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else if (navbar) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Admin function to view stored emails (for development)
function viewStoredEmails() {
    const storedEmails = JSON.parse(localStorage.getItem('fokusWaitlist') || '[]');
    console.table(storedEmails);
    return storedEmails;
}

// Admin function to export emails and survey data (for development)
function exportEmails() {
    const storedEmails = JSON.parse(localStorage.getItem('fokusWaitlist') || '[]');
    
    // Create CSV header with survey fields
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Email,Timestamp,Source,Referrer,UserTypes,PainPoints,UsageContext,Comments\n';
    
    // Add data rows
    csvContent += storedEmails.map(entry => {
        const userTypes = entry.surveyData ? entry.surveyData.userTypes.join(';') : '';
        const painPoints = entry.surveyData ? entry.surveyData.painPoints.join(';') : '';
        const usageContext = entry.surveyData ? entry.surveyData.usageContext.join(';') : '';
        const comments = entry.surveyData ? entry.surveyData.comments.replace(/[",\n\r]/g, ' ') : '';
        
        return `${entry.email},${entry.timestamp},${entry.source},${entry.referrer},"${userTypes}","${painPoints}","${usageContext}","${comments}"`;
    }).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'fokus-waitlist-with-survey.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Make functions globally accessible
window.currentUserEmail = null;
window.storeSurveyData = storeSurveyData;

// Update currentUserEmail globally when it changes
window.setCurrentUserEmail = function(email) {
    window.currentUserEmail = email;
    currentUserEmail = email;
};

// Make admin functions globally accessible in development
window.viewStoredEmails = viewStoredEmails;
window.exportEmails = exportEmails;