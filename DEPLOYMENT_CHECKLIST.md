# 🚀 Deployment Checklist

## ✅ Completed
- [x] PostgreSQL migration complete
- [x] All resolvers converted to PostgreSQL
- [x] Server.js updated to use PostgreSQL
- [x] Railway configuration files created
- [x] Credentials secured (removed from code)
- [x] Documentation created

## 🔄 Next Steps (DO THESE NOW!)

### 1. Push to GitHub
```bash
git push origin devphase
```

### 2. Change Railway PostgreSQL Password (CRITICAL!)
⚠️ **DO THIS IMMEDIATELY** - Your password was exposed in git history
1. Go to https://railway.app
2. Find your PostgreSQL database
3. Click "Variables" or "Settings"
4. Generate a new password
5. Copy the new password

### 3. Create .env File Locally
Create a `.env` file with your NEW credentials:
```env
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=44632
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<paste_new_password_here>

NODE_ENV=development
PORT=4004
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://www.badhosa.com,https://badhosa.com,http://localhost:3000
```

### 4. Test Locally (Optional)
```bash
npm start
# or
yarn start
```
Visit: http://localhost:4004/graphql

### 5. Deploy on Railway
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `Zoomigo_backend`
5. Select `devphase` branch

### 6. Add Environment Variables in Railway
In Railway project settings, add:
```
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=44632
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<your_new_password>
NODE_ENV=production
PORT=4004
JWT_SECRET=<generate_strong_random_string>
CORS_ORIGIN=https://www.badhosa.com,https://badhosa.com
```

### 7. Generate Domain
1. In Railway, go to Settings → Domains
2. Click "Generate Domain"
3. Copy your URL: `https://your-app.up.railway.app`

### 8. Update Frontend
Update your frontend to use the new backend URL:
```
https://your-app.up.railway.app/graphql
```

## 📋 Verification

After deployment, test these queries:

### Test 1: Health Check
```
GET https://your-app.up.railway.app/
```

### Test 2: GraphQL Query
```graphql
query {
  vehicles(filters: { first: 5 }) {
    id
    brand
    model
    pricing {
      perDay
    }
  }
}
```

### Test 3: Login
```graphql
mutation {
  loginUser(email: "test@example.com", password: "password123") {
    token
    user {
      id
      name
      email
    }
  }
}
```

## ⚠️ Important Notes

1. **Both apps use the SAME PostgreSQL database**
   - User app and Vehicle app share data
   - No need to create a new database

2. **Security**
   - Never commit .env file
   - Change PostgreSQL password immediately
   - Use strong JWT_SECRET in production

3. **CORS**
   - Make sure CORS_ORIGIN includes your frontend domain
   - Test from your frontend after deployment

## 🆘 Troubleshooting

### Build Fails
- Check Railway logs
- Verify all dependencies in package.json
- Check Node.js version compatibility

### Database Connection Error
- Verify DB credentials in Railway
- Check if PostgreSQL service is running
- Ensure DB_PASSWORD is correct

### GraphQL Errors
- Check server logs in Railway
- Verify schema matches resolvers
- Test queries in GraphQL playground

## 📞 Support

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Create GitHub issue if needed

---

**Ready to deploy!** Start with step 1 above. 🚀
