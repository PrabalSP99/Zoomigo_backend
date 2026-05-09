# Railway Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected
- MongoDB Atlas account (or use Railway MongoDB)

## Step-by-Step Deployment

### 1. Create New Project on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Zoomigo_backend` repository
5. Select the `devphase` branch (or your main branch)

### 2. Add MongoDB Database (Option A: Railway MongoDB)

1. In your Railway project, click "New"
2. Select "Database" → "Add MongoDB"
3. Railway will automatically create a MongoDB instance
4. Copy the `MONGO_URL` connection string

### 2. Alternative: Use MongoDB Atlas (Option B)

1. Go to https://cloud.mongodb.com
2. Create a cluster (free tier available)
3. Get your connection string
4. Whitelist Railway's IP (or use 0.0.0.0/0 for all IPs)

### 3. Configure Environment Variables

In Railway project settings, add these variables:

```env
NODE_ENV=production
PORT=4004

# MongoDB (use Railway's MONGO_URL or your Atlas connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental_app

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

### 4. Deploy

1. Railway will automatically deploy when you push to GitHub
2. Or click "Deploy" in Railway dashboard
3. Wait for build to complete (2-5 minutes)

### 5. Get Your Deployment URL

1. Go to "Settings" in Railway
2. Under "Domains", click "Generate Domain"
3. Your API will be available at: `https://your-app.up.railway.app`
4. GraphQL endpoint: `https://your-app.up.railway.app/graphql`

### 6. Seed Database (Optional)

After deployment, you can seed the database:

1. Go to Railway project
2. Click on your service
3. Go to "Settings" → "Deploy"
4. Add a custom start command temporarily: `node seed.js && node server.js`
5. Or use Railway CLI:
   ```bash
   railway run node seed.js
   ```

### 7. Custom Domain (Optional)

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
