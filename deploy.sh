#!/bin/bash
# 🚀 TEC Platform - Heroku Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting TEC Platform Deployment to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Installing..."
    npm install -g heroku
fi

echo "🔐 Logging into Heroku..."
heroku login

echo "🏗️ Creating Heroku app..."
read -p "Enter your app name (e.g., tecaikids): " APP_NAME
heroku create $APP_NAME

echo "🗄️ Adding MongoDB database..."
heroku addons:create mongolab:sandbox -a $APP_NAME

echo "⚙️ Setting environment variables..."
heroku config:set REACT_APP_BACKEND_URL=https://$APP_NAME.herokuapp.com -a $APP_NAME
heroku config:set SECRET_KEY=tec-future-ready-learning-platform-secret-key-2024 -a $APP_NAME
heroku config:set STRIPE_API_KEY=sk_test_emergent -a $APP_NAME
heroku config:set CORS_ORIGINS=https://www.tecaikids.com,https://tecaikids.com -a $APP_NAME
heroku config:set NODE_ENV=production -a $APP_NAME

echo "📦 Preparing deployment..."
git init
git add .
git commit -m "Deploy TEC Platform to Heroku"

echo "🚀 Deploying to Heroku..."
heroku git:remote -a $APP_NAME
git push heroku main

echo "🌐 Adding custom domain..."
heroku domains:add www.tecaikids.com -a $APP_NAME
heroku domains:add tecaikids.com -a $APP_NAME

echo "✅ Deployment complete!"
echo "🎯 Your app is available at: https://$APP_NAME.herokuapp.com"
echo "📋 To use www.tecaikids.com, update your DNS settings as shown in DEPLOYMENT_GUIDE.md"

heroku open -a $APP_NAME