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
    
    // Initialize tracking systems
    initAdvancedTracking();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effects
    initNavbarEffects();
    
    // Initialize premium interactions
    initPremiumInteractions();
    
    // Initialize pricing buttons
    initPricingButtons();
    
    // Initialize all button tracking
    initAllButtonTracking();
    
    // Initialize modals
    initModals();
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
        // Store email in Google Sheets with plan tracking
        await storeEmailWithPlan(email);
        
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
// Connected to Google Apps Script for foKus Waitlist - Fresh deployment v3 with fixed survey handling
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwB3N6jFFNcgVPM2n_1Jfz3rLBVo0KUyinnM52e5sPNtj9V-yZNUH9HC16oStdlqNmj/exec';

// Store email in Google Sheets
async function storeEmail(email) {
    try {
        console.log('Attempting to store email:', email);
        console.log('Using URL:', GOOGLE_SCRIPT_URL);
        
        // Use FormData to avoid CORS preflight issues
        const formData = new FormData();
        formData.append('type', 'email_signup');
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', window.location.pathname);
        formData.append('referrer', document.referrer);
        
        // Send email signup to Google Sheets using no-cors mode
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        console.log('Response status:', response.status);
        console.log('Response type:', response.type);
        
        // With no-cors, we can't read the response, but if no error is thrown, it worked
        console.log('Email submission completed');
        
        // Simulate delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true };
    } catch (error) {
        console.error('Detailed error storing email:', error);
        throw error;
    }
}

// Store survey data in Google Sheets
async function storeSurveyData(email, surveyData) {
    try {
        console.log('Attempting to store survey data for:', email);
        console.log('Survey data:', surveyData);
        
        // Use FormData to avoid CORS preflight issues
        const formData = new FormData();
        formData.append('type', 'survey_complete');
        formData.append('email', email);
        formData.append('userTypes', JSON.stringify(surveyData.userTypes || []));
        formData.append('painPoints', JSON.stringify(surveyData.painPoints || []));
        formData.append('usageContext', JSON.stringify(surveyData.usageContext || []));
        formData.append('comments', surveyData.comments || '');
        
        // Send survey data to Google Sheets using no-cors mode
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        console.log('Survey submission completed');
        
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

// =============================================================================
// ADVANCED TRACKING SYSTEM
// =============================================================================

// Initialize comprehensive tracking
function initAdvancedTracking() {
    trackPageLoad();
    initSectionTracking();
    initScrollDepthTracking();
    initTimeTracking();
    initOutboundLinkTracking();
}

// Track page load with timing
function trackPageLoad() {
    window.addEventListener('load', () => {
        const loadTime = Math.round(performance.now());
        trackEvent('page_load', 'performance', 'load_time', loadTime);
        
        // Track user device info
        const deviceInfo = {
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            device_type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
            user_agent: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
        };
        
        Object.entries(deviceInfo).forEach(([key, value]) => {
            trackEvent('device_info', 'technical', key, value);
        });
    });
}

// Track section visibility
function initSectionTracking() {
    const sections = ['hero', 'insights', 'problem', 'how-it-works', 'testimonials', 'pricing', 'waitlist'];
    const sectionTimes = {};
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionName = entry.target.id;
            
            if (entry.isIntersecting) {
                sectionTimes[sectionName] = Date.now();
                trackEvent('section_view', 'engagement', sectionName, Math.round(entry.intersectionRatio * 100));
            } else if (sectionTimes[sectionName]) {
                const timeSpent = Math.round((Date.now() - sectionTimes[sectionName]) / 1000);
                trackEvent('section_time', 'engagement', sectionName, timeSpent);
                delete sectionTimes[sectionName];
            }
        });
    }, { threshold: [0.1, 0.5, 0.9] });

    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            sectionObserver.observe(element);
        }
    });
}

// Track scroll depth
function initScrollDepthTracking() {
    const scrollMilestones = [25, 50, 75, 90, 100];
    const reached = new Set();
    
    let ticking = false;
    
    function trackScrollDepth() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        scrollMilestones.forEach(milestone => {
            if (scrollPercent >= milestone && !reached.has(milestone)) {
                reached.add(milestone);
                trackEvent('scroll_depth', 'engagement', `${milestone}_percent`, scrollPercent);
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(trackScrollDepth);
            ticking = true;
        }
    });
}

// Track time on page
function initTimeTracking() {
    const startTime = Date.now();
    let heartbeatInterval;
    
    // Send heartbeat every 30 seconds
    heartbeatInterval = setInterval(() => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', 'engagement', 'heartbeat', timeSpent);
    }, 30000);
    
    // Track when user leaves
    window.addEventListener('beforeunload', () => {
        clearInterval(heartbeatInterval);
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        trackEvent('session_end', 'engagement', 'total_time', totalTime);
    });
    
    // Track when user becomes inactive
    let lastActivity = Date.now();
    let isActive = true;
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => {
            lastActivity = Date.now();
            if (!isActive) {
                isActive = true;
                trackEvent('user_active', 'engagement', 'resumed');
            }
        });
    });
    
    // Check for inactivity every 10 seconds
    setInterval(() => {
        if (Date.now() - lastActivity > 30000 && isActive) {
            isActive = false;
            trackEvent('user_inactive', 'engagement', 'idle');
        }
    }, 10000);
}

// Track outbound links
function initOutboundLinkTracking() {
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.href) {
            const url = new URL(e.target.href);
            if (url.hostname !== window.location.hostname) {
                trackEvent('outbound_click', 'navigation', url.hostname, e.target.href);
            }
        }
    });
}

// =============================================================================
// PRICING BUTTONS & MODALS
// =============================================================================

function initPricingButtons() {
    // Free plan button
    document.querySelector('[data-plan="free"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        const planData = e.target.dataset;
        
        // Detailed button tracking
        trackEvent('button_click', 'conversion', 'free_plan_button', 0);
        trackEvent('plan_interest', 'conversion', 'free_plan', 0);
        trackEvent('cta_click', 'engagement', 'get_started_free', 1);
        
        console.log('🎯 FREE PLAN BUTTON CLICKED!');
        
        // Store plan preference
        localStorage.setItem('selectedPlan', 'free');
        localStorage.setItem('planPrice', '0');
        
        // Scroll to waitlist with smooth animation
        document.getElementById('waitlist').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Highlight the email form briefly
        setTimeout(() => {
            const emailForm = document.querySelector('.premium-form');
            if (emailForm) {
                emailForm.style.transform = 'scale(1.02)';
                emailForm.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.3)';
                setTimeout(() => {
                    emailForm.style.transform = 'scale(1)';
                    emailForm.style.boxShadow = '';
                }, 1000);
            }
        }, 500);
    });
    
    // Pro plan button
    document.querySelector('[data-plan="pro"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        const planData = e.target.dataset;
        
        // Detailed button tracking
        trackEvent('button_click', 'conversion', 'pro_plan_button', 4.99);
        trackEvent('plan_interest', 'conversion', 'pro_plan', 4.99);
        trackEvent('cta_click', 'engagement', 'start_free_trial', 1);
        
        console.log('🎯 PRO PLAN BUTTON CLICKED! - $4.99/mo');
        
        localStorage.setItem('selectedPlan', 'pro');
        localStorage.setItem('planPrice', '4.99');
        
        showComingSoonModal();
    });
    
    // Enterprise plan button
    document.querySelector('[data-plan="enterprise"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        const planData = e.target.dataset;
        
        // Detailed button tracking
        trackEvent('button_click', 'conversion', 'enterprise_plan_button');
        trackEvent('plan_interest', 'conversion', 'enterprise_plan');
        trackEvent('cta_click', 'engagement', 'contact_sales', 1);
        
        console.log('🎯 ENTERPRISE BUTTON CLICKED! - High-value lead');
        
        localStorage.setItem('selectedPlan', 'enterprise');
        localStorage.setItem('planPrice', 'custom');
        
        showContactModal();
    });
}

// Track all other important buttons
function initAllButtonTracking() {
    // Email form buttons
    document.querySelectorAll('.email-form button[type="submit"]')?.forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('button_click', 'conversion', 'email_submit_button', 1);
            console.log('📧 EMAIL SUBMIT BUTTON CLICKED!');
        });
    });
    
    // Navigation buttons
    document.querySelectorAll('a[href="#pricing"]')?.forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('button_click', 'navigation', 'pricing_nav_button', 1);
            console.log('🧭 PRICING NAVIGATION CLICKED!');
        });
    });
    
    // Join Waitlist nav buttons
    document.querySelectorAll('a[href="#waitlist"]')?.forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('button_click', 'navigation', 'waitlist_nav_button', 1);
            console.log('📝 WAITLIST NAVIGATION CLICKED!');
        });
    });
    
    // Survey buttons
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        trackEvent('button_click', 'engagement', 'survey_next_button', 1);
        console.log('➡️ SURVEY NEXT BUTTON CLICKED!');
    });
    
    document.getElementById('submitBtn')?.addEventListener('click', () => {
        trackEvent('button_click', 'engagement', 'survey_submit_button', 1);
        console.log('✅ SURVEY SUBMIT BUTTON CLICKED!');
    });
    
    document.getElementById('skipBtn')?.addEventListener('click', () => {
        trackEvent('button_click', 'engagement', 'survey_skip_button', 1);
        console.log('⏭️ SURVEY SKIP BUTTON CLICKED!');
    });
}

function initModals() {
    // Coming Soon Modal
    const comingSoonModal = document.getElementById('comingSoonModal');
    const closeComingSoonBtn = document.getElementById('closeComingSoonModal');
    
    closeComingSoonBtn?.addEventListener('click', hideComingSoonModal);
    comingSoonModal?.addEventListener('click', (e) => {
        if (e.target === comingSoonModal) hideComingSoonModal();
    });
    
    // Pro waitlist form
    document.getElementById('proWaitlistForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('proEmail').value;
        
        trackEvent('pro_waitlist_signup', 'conversion', 'email_submitted', email);
        
        try {
            await storeSpecialEmail(email, 'pro_waitlist');
            hideComingSoonModal();
            showMessage('🎉 You\'re on the Pro waitlist! We\'ll notify you with early access.', 'success');
        } catch (error) {
            showMessage('Something went wrong. Please try again.', 'error');
        }
    });
    
    // Contact Modal
    const contactModal = document.getElementById('contactModal');
    const closeContactBtn = document.getElementById('closeContactModal');
    
    closeContactBtn?.addEventListener('click', hideContactModal);
    contactModal?.addEventListener('click', (e) => {
        if (e.target === contactModal) hideContactModal();
    });
    
    // Enterprise contact form
    document.getElementById('enterpriseContactForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const contactData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('enterpriseEmail').value,
            company: document.getElementById('company').value,
            teamSize: document.getElementById('teamSize').value,
            message: document.getElementById('message').value
        };
        
        trackEvent('enterprise_contact', 'conversion', 'form_submitted', contactData.teamSize);
        
        try {
            await storeEnterpriseContact(contactData);
            hideContactModal();
            showMessage('🎉 Thanks! We\'ll contact you within 24 hours to discuss your needs.', 'success');
        } catch (error) {
            showMessage('Something went wrong. Please try again.', 'error');
        }
    });
}

// Modal show/hide functions
function showComingSoonModal() {
    document.getElementById('comingSoonModal').classList.remove('hidden');
    trackEvent('modal_view', 'engagement', 'pro_coming_soon');
}

function hideComingSoonModal() {
    document.getElementById('comingSoonModal').classList.add('hidden');
    document.getElementById('proEmail').value = '';
}

function showContactModal() {
    document.getElementById('contactModal').classList.remove('hidden');
    trackEvent('modal_view', 'engagement', 'enterprise_contact');
}

function hideContactModal() {
    document.getElementById('contactModal').classList.add('hidden');
    document.getElementById('enterpriseContactForm').reset();
}

// =============================================================================
// ENHANCED EMAIL STORAGE WITH PLAN TRACKING
// =============================================================================

// Store special emails (Pro waitlist, Enterprise contacts)
async function storeSpecialEmail(email, type) {
    try {
        const formData = new FormData();
        formData.append('type', 'special_signup');
        formData.append('email', email);
        formData.append('signupType', type);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', window.location.pathname);
        formData.append('referrer', document.referrer);
        formData.append('selectedPlan', localStorage.getItem('selectedPlan') || 'unknown');
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        console.log('Special email stored:', type, email);
        return { success: true };
    } catch (error) {
        console.error('Error storing special email:', error);
        throw error;
    }
}

// Store enterprise contact info
async function storeEnterpriseContact(contactData) {
    try {
        const formData = new FormData();
        formData.append('type', 'enterprise_contact');
        formData.append('firstName', contactData.firstName);
        formData.append('lastName', contactData.lastName);
        formData.append('email', contactData.email);
        formData.append('company', contactData.company);
        formData.append('teamSize', contactData.teamSize);
        formData.append('message', contactData.message);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', window.location.pathname);
        formData.append('referrer', document.referrer);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        console.log('Enterprise contact stored:', contactData.email);
        return { success: true };
    } catch (error) {
        console.error('Error storing enterprise contact:', error);
        throw error;
    }
}

// Enhanced email storage with plan preference
async function storeEmailWithPlan(email) {
    try {
        const formData = new FormData();
        formData.append('type', 'email_signup');
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', window.location.pathname);
        formData.append('referrer', document.referrer);
        formData.append('selectedPlan', localStorage.getItem('selectedPlan') || 'unknown');
        formData.append('planPrice', localStorage.getItem('planPrice') || 'unknown');
        formData.append('userAgent', navigator.userAgent);
        formData.append('viewportSize', `${window.innerWidth}x${window.innerHeight}`);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        console.log('Email stored with plan preference');
        return { success: true };
    } catch (error) {
        console.error('Error storing email with plan:', error);
        throw error;
    }
}

// Helper function for tracking events
function trackEvent(action, category, label, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
            custom_parameter_1: localStorage.getItem('selectedPlan'),
            custom_parameter_2: window.location.pathname
        });
    }
    
    // Also log to console for debugging
    console.log('📊 Event:', action, { category, label, value });
}