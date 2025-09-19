# Docker Commands

## Build and Run
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## Individual Services
```bash
# Build backend only
docker build -t skillbridge-backend ./server

# Build frontend only  
docker build -t skillbridge-frontend ./client

# Run backend
docker run -p 5000:5000 --env-file ./server/.env skillbridge-backend

# Run frontend
docker run -p 80:80 skillbridge-frontend
```

## Production
```bash
# Production build
docker-compose -f docker-compose.prod.yml up --build

# Push to registry
docker tag skillbridge-backend your-registry/skillbridge-backend
docker push your-registry/skillbridge-backend
```