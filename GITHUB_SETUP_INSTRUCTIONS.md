# 🐙 GitHub Private Repository Setup for TEC Platform

## 📋 **Complete Setup Instructions (10 minutes)**

---

## **Step 1: Create GitHub Account & Private Repository (3 minutes)**

### **A. Create GitHub Account**
1. **Visit**: https://github.com/signup
2. **Sign up** with your email
3. **Verify** your email address
4. **Choose plan**: Free (you'll upgrade for private repos)

### **B. Create Private Repository**
1. **Click**: "New repository" (+ icon in top right)
2. **Repository name**: `tec-platform`
3. **Description**: `TEC Future-Ready Learning Platform - Private Business Repository`
4. **Visibility**: ⚠️ **Select "Private"**
5. **Initialize**: ☑️ Check "Add a README file"
6. **Click**: "Create repository"

### **C. Upgrade to GitHub Pro (for private repos)**
1. **Go to**: GitHub Settings → Billing and plans
2. **Upgrade to**: GitHub Pro ($4/month)
3. **This enables**: Unlimited private repositories

---

## **Step 2: Upload TEC Platform Code (4 minutes)**

### **Option A: Web Upload (Easiest)**
1. **In your new repository**, click "uploading an existing file"
2. **Drag and drop** the entire `/app` folder contents
3. **Commit message**: `Initial TEC Platform deployment`
4. **Click**: "Commit changes"

### **Option B: Git Commands (Advanced)**
```bash
# Clone your empty repository
git clone https://github.com/YOUR_USERNAME/tec-platform.git
cd tec-platform

# Copy all TEC platform files to this directory
# (Copy everything from /app/ folder)

# Add all files
git add .
git commit -m "Deploy TEC Future-Ready Learning Platform"
git push origin main
```

---

## **Step 3: Configure One-Click Deploy (2 minutes)**

### **A. Update Deploy Button**
1. **Edit** the `README.md` file in your repository
2. **Find this line**:
   ```
   [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/YOUR_USERNAME/tec-platform)
   ```
3. **Replace** `YOUR_USERNAME` with your actual GitHub username
4. **Save** the file

### **B. Test the Deploy Button**
1. **View** your repository README
2. **Click** the "Deploy to Heroku" button
3. **Verify** it opens Heroku deployment page
4. **Don't deploy yet** - just test the link works

---

## **Step 4: Deploy to Heroku (5 minutes)**

### **A. Deploy Your Platform**
1. **Click** the "Deploy to Heroku" button in your README
2. **Create Heroku account** (if needed)
3. **App name**: `tecaikids` or `tec-platform-2024`
4. **Region**: Choose closest to Sri Lanka
5. **Click**: "Deploy App"
6. **Wait**: 5-10 minutes for deployment

### **B. Verify Deployment**
1. **Click**: "View" when deployment completes
2. **Test**: Your app at `https://your-app-name.herokuapp.com`
3. **Login**: Use `student@tecaikids.com` / `student123`
4. **Check**: All features work (dashboard, achievements, etc.)

---

## **Step 5: Configure www.tecaikids.com (6 minutes)**

### **A. Add Custom Domain in Heroku**
1. **Go to**: Your Heroku app dashboard
2. **Click**: Settings tab
3. **Scroll to**: "Domains and certificates"
4. **Click**: "Add domain"
5. **Enter**: `www.tecaikids.com`
6. **Enter**: `tecaikids.com` (add second domain)
7. **Copy**: The DNS target (like `abc123.herokudns.com`)

### **B. Update DNS at Your Domain Registrar**
1. **Login** to where you bought tecaikids.com
2. **Find**: DNS Management or DNS Settings
3. **Add CNAME record**:
   - **Name**: `www`
   - **Value**: `abc123.herokudns.com` (from Heroku)
   - **TTL**: 300
4. **Add CNAME record** for root domain:
   - **Name**: `@` or leave blank
   - **Value**: `abc123.herokudns.com`
   - **TTL**: 300
5. **Save** DNS changes

### **C. Wait for DNS Propagation**
- **Time**: 5-60 minutes for changes to take effect
- **Test**: Visit www.tecaikids.com periodically
- **Check**: https://dnschecker.org/ to monitor progress

---

## **Step 6: Final Verification (2 minutes)**

### **✅ Test Your Live Platform**
1. **Visit**: https://www.tecaikids.com
2. **Test login**: `admin@tecaikids.com` / `admin123`
3. **Check features**:
   - Dashboard ✅
   - Achievements ✅  
   - Quizzes ✅
   - Workouts ✅
   - Subscription page ✅
4. **Test NINA landing**: https://www.tecaikids.com/landing
5. **Test enrollment flow**: NINA → Registration → Login

---

## **🎛️ Step 7: Production Configuration**

### **A. Enable Live Payments (When Ready)**
1. **Get live Stripe API key** from Stripe dashboard
2. **In Heroku**: Settings → Config Vars
3. **Update**: `STRIPE_API_KEY` with live key (replace test key)

### **B. Add Monitoring (Optional)**
```bash
# In your Heroku app
heroku addons:create newrelic:wayne
heroku addons:create papertrail:choklad
```

---

## **💰 Monthly Cost Summary**

| Service | Cost | Purpose |
|---------|------|---------|
| **GitHub Pro** | $4/month | Private repository |
| **Heroku Dyno** | $25/month | App hosting |
| **MongoDB Atlas** | $15/month | Database |
| **Total** | **$44/month** | Complete platform |

---

## **🆘 Troubleshooting**

### **Repository Issues**
- **Private repo not available**: Upgrade to GitHub Pro
- **Deploy button not working**: Check username in README.md URL
- **Upload failed**: Try smaller batches or Git commands

### **Heroku Deployment Issues**
- **Build failed**: Check `requirements.txt` and `package.json`
- **App crashed**: View logs in Heroku dashboard
- **Database connection**: Verify MongoDB addon installed

### **DNS Issues**
- **www.tecaikids.com not working**: Check CNAME records
- **Taking too long**: DNS propagation can take up to 48 hours
- **SSL errors**: Heroku auto-provides SSL, wait for activation

---

## **🎉 Success Checklist**

### **✅ Repository Setup Complete**
- [ ] GitHub Pro account created ($4/month)
- [ ] Private repository `tec-platform` created
- [ ] All TEC platform code uploaded
- [ ] Deploy button configured with correct username

### **✅ Heroku Deployment Complete**
- [ ] App deployed successfully to Heroku
- [ ] MongoDB database connected
- [ ] Environment variables configured
- [ ] Test login working at herokuapp.com URL

### **✅ Domain Configuration Complete**
- [ ] Custom domain added in Heroku
- [ ] DNS CNAME records added at registrar
- [ ] www.tecaikids.com resolving correctly
- [ ] SSL certificate active (HTTPS working)

### **✅ Platform Verification Complete**
- [ ] All user authentication working
- [ ] Dashboard and features functional
- [ ] NINA landing page accessible
- [ ] Stripe payment system ready
- [ ] Mobile responsive design confirmed

---

## **🚀 Final Result**

**Your TEC Future-Ready Learning Platform is now live at:**
- **🌟 Main Platform**: https://www.tecaikids.com
- **📢 Marketing Landing**: https://www.tecaikids.com/landing
- **🔒 Private Repository**: https://github.com/YOUR_USERNAME/tec-platform

**🎓 Congratulations! Your 42-year educational legacy is now online!**

---

## **📈 Next Steps**

1. **Content Creation**: Add more courses and learning materials
2. **User Testing**: Invite beta users to test platform
3. **Marketing Launch**: Announce www.tecaikids.com availability
4. **Performance Monitoring**: Track usage and optimize
5. **Feature Enhancement**: Add requested functionality

**Your platform is production-ready and scalable!** 🎉