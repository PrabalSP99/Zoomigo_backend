# Docker Deployment Guide

This guide explains how to deploy the RentalAPP using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RentalAPP
   ```

2. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp env-template.txt .env
   
   # Edit .env with your actual values
   nano .env
   ```

3. **Start the application**
   ```bash
   cd Backend
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4004
   - GraphQL Playground: http://localhost:4004/graphql

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://admin:password@mongodb:27017/rentalapp` |
| `SENDGRID_API_KEY` | SendGrid API key for emails | `SG.xxx` |
| `SENDGRID_FROM_EMAIL` | Verified sender email | `noreply@yourdomain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Backend port | `4004` |
| `MONGO_ROOT_USERNAME` | MongoDB root username | `admin` |
| `MONGO_ROOT_PASSWORD` | MongoDB root password | `password` |

## Docker Services

### MongoDB (`mongodb`)
- **Image**: `mongo:7.0`
- **Port**: `27017`
- **Volume**: `mongodb_data`
- **Initialization**: Custom script for collections and indexes

### Backend (`backend`)
- **Build**: `./Backend/Dockerfile`
- **Port**: `4004`
- **Dependencies**: MongoDB
- **Health Check**: HTTP endpoint check

### Frontend (`frontend`)
- **Build**: `./client/Dockerfile`
- **Port**: `3000`
- **Dependencies**: Backend
- **Health Check**: API health endpoint

## Docker Commands

### Development
```bash
# Navigate to Backend directory
cd Backend

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

### Production
```bash
# Navigate to Backend directory
cd Backend

# Start with production environment
NODE_ENV=production docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Maintenance
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Access backend container
docker-compose exec backend sh

# Access frontend container
docker-compose exec frontend sh

# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /backup
```

## GitHub Container Registry (GHCR)

The application includes GitHub Actions workflow for automatic Docker image building and pushing to GHCR.

### Workflow Features
- Builds both backend and frontend images
- Pushes to `ghcr.io/your-username/your-repo/backend` and `ghcr.io/your-username/your-repo/frontend`
- Supports multi-platform builds (amd64, arm64)
- Generates SBOM (Software Bill of Materials)
- Caches Docker layers for faster builds

### Using GHCR Images
```bash
# Pull images
docker pull ghcr.io/your-username/your-repo/backend:latest
docker pull ghcr.io/your-username/your-repo/frontend:latest

# Use in production
docker run -d --name rentalapp-backend \
  -p 4004:4004 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  ghcr.io/your-username/your-repo/backend:latest
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Secrets Management**: Use Docker secrets or external secret management for production
3. **Network Security**: Use Docker networks to isolate services
4. **Image Security**: Regularly update base images and scan for vulnerabilities
5. **Access Control**: Implement proper authentication and authorization

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :4004
   
   # Change ports in docker-compose.yml
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Verify connection string
   docker-compose exec backend node -e "console.log(process.env.MONGODB_URI)"
   ```

3. **Build Failures**
   ```bash
   # Clean build cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   
   # Check Docker daemon permissions
   sudo usermod -aG docker $USER
   ```

### Health Checks

Monitor service health:
```bash
# Check all services
docker-compose ps

# Check specific service health
docker inspect rentalapp-backend | grep -A 10 Health
```

## Performance Optimization

1. **Resource Limits**: Set memory and CPU limits in docker-compose.yml
2. **Caching**: Use Docker layer caching for faster builds
3. **Multi-stage Builds**: Optimize image sizes with multi-stage Dockerfiles
4. **Health Checks**: Implement proper health checks for better orchestration

## Monitoring and Logging

1. **Log Aggregation**: Use centralized logging solutions
2. **Metrics**: Implement application metrics and monitoring
3. **Alerting**: Set up alerts for service failures
4. **Backup**: Regular database backups and disaster recovery plans

## Support

For issues and questions:
- Check the application logs: `docker-compose logs`
- Review the GitHub Actions workflow logs
- Consult the application documentation
- Create an issue in the repository
