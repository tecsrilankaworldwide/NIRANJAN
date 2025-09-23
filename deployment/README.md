# TecaiKids Unified Platform - Hostinger Deployment Guide

## 🎉 Welcome to TecaiKids Unified Platform!

This deployment package contains the complete **unified TecaiKids educational platform** covering ages 4-18 with integrated payment processing and subscription management.

## 📁 Files to Upload

### Required Files:
1. **`index.html`** - Main application file (unified platform)
2. **`static/`** folder - Contains all CSS, JavaScript, and asset files
3. **`contact.php`** - Contact form handler
4. **`PRICING_EDITOR_GUIDE.txt`** - Guide for editing pricing

### Upload Instructions for Hostinger:

1. **Access File Manager**:
   - Log into your Hostinger control panel
   - Go to **File Manager** 
   - Navigate to `public_html` directory

2. **Upload Files**:
   - Upload `index.html` to the root of `public_html`
   - Upload the entire `static` folder to `public_html`
   - Upload `contact.php` to `public_html`

3. **Set Permissions**:
   - Set `contact.php` permissions to 755
   - Ensure `static` folder is readable (644 for files, 755 for folders)

## 🌟 Platform Features

### Unified Age Levels:
- 🌟 **Little Learners** (Ages 4-6): LKR 800/month, LKR 2,800/quarterly
- 🚀 **Young Explorers** (Ages 7-9): LKR 1,200/month, LKR 4,200/quarterly  
- ⚡ **Smart Kids** (Ages 10-12): LKR 1,500/month, LKR 5,250/quarterly
- 💻 **Tech Teens** (Ages 13-15): LKR 2,000/month, LKR 7,000/quarterly
- 🎯 **Future Leaders** (Ages 16-18): LKR 2,500/month, LKR 8,750/quarterly

### Payment Integration:
- ✅ **Stripe**: Credit/debit card payments (ready for live keys)
- ✅ **Bank Transfer**: Direct transfer to TEC Sri Lanka Worldwide - Bank of Ceylon
- ⏳ **eZ Cash**: Coming soon (placeholder implemented)

### Key Features:
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile
- 🎯 **Age-Appropriate Content**: Automatically adapts to user age
- 📚 **Quarterly Workbooks**: Physical material delivery system
- 🏆 **Achievement System**: Gamified learning experience
- 📊 **Progress Tracking**: Comprehensive analytics
- 🇱🇰 **Sri Lankan Context**: LKR pricing, local banking integration

## 💳 Payment Setup (IMPORTANT)

### For Production (Live Payments):
1. **Stripe Setup**:
   - Get live Stripe API keys from https://dashboard.stripe.com
   - Replace test keys in the backend configuration
   - Test with small amounts before going live

2. **Bank Transfer**:
   - Update bank account details in `PRICING_EDITOR_GUIDE.txt`
   - Currently set for "TEC Sri Lanka Worldwide (Pvt.) Ltd - Bank of Ceylon"

3. **eZ Cash Integration**:
   - Contact eZ Cash for merchant account setup
   - Integration code is ready for API keys

## 📞 Contact Form

The contact form (`contact.php`) is configured to send emails. Update the email settings:

```php
$to = "hello@tecaikids.com"; // Change to your email
$from = "noreply@yourdomain.com"; // Change to your domain
```

## 🔧 Configuration

### Backend API (For Dynamic Features):
The current deployment is static. For full functionality (user accounts, payments, progress tracking), you'll need:
1. **Database**: MongoDB or MySQL
2. **Backend Server**: Node.js or Python hosting
3. **Payment Processing**: Live Stripe webhook endpoints

### Static Version Features:
- ✅ Complete UI and navigation
- ✅ Pricing display and information  
- ✅ Contact form functionality
- ✅ Responsive design
- ❌ User accounts (requires backend)
- ❌ Live payment processing (requires backend)
- ❌ Progress tracking (requires backend)

## 🚀 Going Live

### Immediate (Static Version):
1. Upload files as instructed above
2. Update contact email in `contact.php`
3. Test contact form functionality
4. Verify all pages load correctly

### Full Platform (Dynamic Version):
1. Set up backend infrastructure
2. Configure database
3. Set up payment webhooks
4. Deploy API endpoints
5. Update frontend API URLs

## 📱 Testing Checklist

After deployment, test:
- [ ] Homepage loads with unified age levels
- [ ] Pricing page displays correct LKR amounts
- [ ] Contact form sends emails
- [ ] All pages are responsive on mobile
- [ ] Navigation works correctly
- [ ] Age selector displays properly

## 📈 Analytics

Consider adding:
- **Google Analytics** for traffic monitoring
- **Facebook Pixel** for marketing insights
- **Hotjar** for user behavior analysis

## 🛠️ Support

For technical support or customizations:
- Contact: hello@tecaikids.com
- Platform: TEC Sri Lanka Worldwide Initiative

---

**Corporate Information:**
- **Company**: TEC Sri Lanka Worldwide (Pvt.) Ltd
- **Platform**: TecaiKids Unified Learning System
- **Target Audience**: Sri Lankan children ages 4-18
- **Curriculum**: Designed by ex-NIE educationist

---

🎉 **Your unified TecaiKids platform is ready for the world!**