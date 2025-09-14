# Fokus App - Market Validation Website

A clean, informative landing page to validate market demand for the Fokus digital wellness app.

## 🎯 Purpose

- **Market Validation**: Test interest in digital wellness solutions
- **Email Collection**: Build waitlist of potential beta users
- **Traffic Analysis**: Measure engagement and interest levels
- **User Feedback**: Understand target audience needs

## 🚀 Features

- **Responsive Design**: Works on all devices
- **Email Capture**: Simple waitlist signup
- **Analytics Ready**: Easy integration with Google Analytics, Facebook Pixel
- **Fast Loading**: Optimized performance
- **SEO Friendly**: Proper meta tags and structure

## 📊 Tracking & Analytics

### Email Capture
- Emails stored locally (replace with backend API)
- Form validation and user feedback
- Conversion tracking ready

### Admin Functions (Development)
```javascript
// View captured emails
viewStoredEmails()

// Export emails as CSV
exportEmails()
```

## 🔧 Setup Instructions

### 1. Local Development
```bash
# Navigate to the website folder
cd /Users/anesbs/fokus-website

# Serve locally (Python 3)
python3 -m http.server 8000

# Or use Node.js serve
npx serve .

# Visit: http://localhost:8000
```

### 2. Deploy Options

#### GitHub Pages (Free)
1. Create GitHub repository
2. Upload files
3. Enable Pages in Settings
4. Custom domain: `fokusapp.com`

#### Netlify (Free)
1. Drag & drop folder to Netlify
2. Automatic deployments
3. Custom domain support
4. Form handling built-in

#### Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Custom domain in dashboard
```

## 📈 Analytics Integration

### Google Analytics
Add to `<head>` in `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Facebook Pixel
Add to `<head>`:
```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

## 🎨 Customization

### Colors
Update CSS variables in `styles.css`:
```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --accent: #10b981;
}
```

### Content
Edit `index.html` sections:
- Hero messaging
- Problem statements
- Feature descriptions
- App previews

### Images
Add app screenshots:
1. Replace phone mockup content
2. Add real app screenshots
3. Update preview sections

## 📝 Backend Integration

### Email API Example
Replace localStorage in `script.js`:
```javascript
async function storeEmail(email) {
    const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            timestamp: new Date().toISOString(),
            source: window.location.pathname
        })
    });
    
    if (!response.ok) throw new Error('Failed to store email');
    return await response.json();
}
```

## 📊 Key Metrics to Track

### Traffic Metrics
- **Page views** and **unique visitors**
- **Traffic sources** (organic, social, referral, direct)
- **Time on site** and **bounce rate**
- **Device/browser breakdown**

### Conversion Metrics
- **Email signup rate** (target: 2-5%)
- **Section engagement** (scroll depth)
- **Form abandonment rate**
- **Return visitors**

### Content Performance
- **Most viewed sections** (heatmaps)
- **Popular features** (click tracking)
- **User flow** through the page

## 🚀 Marketing Ideas

### SEO
- Blog about digital wellness
- Target keywords: "digital wellness app", "phone usage tracker"
- Local SEO if targeting specific regions

### Social Media
- Share app development progress
- Digital wellness tips
- Behind-the-scenes content

### Content Marketing
- Digital wellness guides
- Usage statistics and insights
- App comparison articles

## 📞 Next Steps

1. **Deploy website** to chosen platform
2. **Set up analytics** (GA, Facebook Pixel)
3. **Create social media** accounts
4. **Start content marketing** to drive traffic
5. **A/B test** different messaging
6. **Collect feedback** from visitors
7. **Iterate** based on data

## 🛠 Technical Notes

- Pure HTML/CSS/JS (no frameworks)
- Mobile-first responsive design
- Fast loading with minimal dependencies
- SEO optimized structure
- Accessible design principles

## 📬 Contact

For questions about this website:
- Email: hello@fokusapp.com (update in footer)
- GitHub: Create issues for bug reports

---

**Goal**: Validate market demand and build audience before full app launch!