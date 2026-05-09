# Railway Deployment Guide - Using Existing PostgreSQL

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected
- **Existing Railway PostgreSQL database** (already created)

## Step-by-Step Deployment

### 1. Create New Project on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Zoomigo_backend` repository
5. Select the `devphase` branch (or your main branch)

### 2. Use Your Existing PostgreSQL Database

**IMPORTANT**: You already have a PostgreSQL database on Railway. You'll use the SAME database for this backend.

1. In your Railway dashboard, find your existing PostgreSQL service
2. Copy the connection details:
   - Host: `shuttle.proxy.rlwy.net`
   - Port: `44632`
   - Database: `railway`
   - User: `postgres`
   - Password: `<YOUR_NEW_PASSWORD>` (the one you changed after the security incident)

### 3. Configure Environment Variables

In Railway project settings, add these variables:

```env
NODE_ENV=production
PORT=4004

# PostgreSQL (use your existing Railway PostgreSQL credentials)
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=44632
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<your_new_railway_postgres_password>

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# CORS (add your frontend domain)
CORS_ORIGIN=https://www.badhosa.com,https://badhosa.com

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# AWS S3 (if using image uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

### 4. Update server.js to Use PostgreSQL

**IMPORTANT**: Your current server.js uses MongoDB. You need to switch to PostgreSQL.

Change this line in server.js:
```javascript
const connectDB = require('./config/database'); // MongoDB
```

To:
```javascript
const pool = require('./config/database_pg'); // PostgreSQL
```

And remove the MongoDB connection:
```javascript
// Remove this line:
connectDB();
```

### 5. Deploy

1. Railway will automatically deploy when you push to GitHub
2. Or click "Deploy" in Railway dashboard
3. Wait for build to complete (2-5 minutes)

### 6. Get Your Deployment URL

1. Go to "Settings" in Railway
2. Under "Domains", click "Generate Domain"
3. Your API will be available at: `https://your-app.up.railway.app`
4. GraphQL endpoint: `https://your-app.up.railway.app/graphql`

### 7. Database Tables Setup

Your PostgreSQL database should already have tables from your previous setup. If not, you'll need to run migrations or create tables.

### 8. Custom Domain (Optional)

1. In Railway, go to "Settings" → "Domains"
2. Click "Custom Domain"
3. Add your domain (e.g., api.badhosa.com)
4. Update your DNS records as instructed

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| NODE_ENV | Yes | Set to `production` |
| PORT | No | Railway auto-assigns (default: 4004) |
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Secret key for JWT tokens |
| CORS_ORIGIN | Yes | Allowed frontend domains |
| SENDGRID_API_KEY | Optional | For email notifications |
| SENDGRID_FROM_EMAIL | Optional | Sender email address |

## Monitoring & Logs

- View logs in Railway dashboard under "Deployments"
- Monitor resource usage in "Metrics"
- Set up alerts in "Settings" → "Notifications"

## Troubleshooting

### Build Fails
- Check logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure CORS_ORIGIN includes your frontend domain

### Environment Variables Not Working
- Restart the service after adding variables
- Check for typos in variable names
- Ensure no quotes around values in Railway UI

## Automatic Deployments

Railway automatically deploys when you:
- Push to your connected GitHub branch
- Merge a pull request
- Manually trigger deployment

## Cost Estimation

Railway offers:
- $5 free credit per month
- Pay-as-you-go after free tier
- Estimated cost: $5-10/month for small apps

## Rollback

To rollback to a previous deployment:
1. Go to "Deployments" tab
2. Find the working deployment
3. Click "Redeploy"

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create an issue in your repo
