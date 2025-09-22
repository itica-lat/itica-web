# Nginx Configuration for Itica.lat and Personality.itica.lat

This document explains the updated nginx configuration for handling both the main Itica website and the Personality app.

## Configuration Overview

The `nginx.conf` file now includes complete configuration for:

### 1. Main Domain (itica.lat)
- **HTTP Redirect**: All HTTP traffic redirected to HTTPS
- **WWW Redirect**: `www.itica.lat` redirected to `itica.lat`
- **Static Files**: Serves React app from `/usr/share/nginx/html`
- **API Routing**: Proxies `/api/` to backend container on port 3001
- **Personality Sub-app**: Proxies `/personality` to personality container on port 8081

### 2. Personality Subdomain (personality.itica.lat)
- **HTTP Redirect**: All HTTP traffic redirected to HTTPS
- **Direct Proxy**: All requests proxied to personality container on port 8081
- **Dedicated Domain**: Full personality app available at subdomain

## Server Blocks

### Main Domain Configuration
```nginx
server {
    listen 443 ssl;
    server_name itica.lat;

    # Main site at /
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Personality app at /personality
    location /personality {
        proxy_pass http://localhost:8081;
    }

    # Main API at /api/
    location /api/ {
        proxy_pass http://backend:3001/;
    }

    # Personality API at /personality/api/
    location /personality/api/ {
        proxy_pass http://localhost:8081/api/;
    }
}
```

### Personality Subdomain Configuration
```nginx
server {
    listen 443 ssl;
    server_name personality.itica.lat;

    # Everything proxied to personality container
    location / {
        proxy_pass http://localhost:8081;
    }
}
```

## Key Features

### SSL Configuration
- Modern TLS (1.2 and 1.3)
- Strong cipher suites
- HSTS enabled
- Certificate path: `/etc/ssl/certs/itica.lat.crt`

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: enabled
- X-Content-Type-Options: nosniff
- Content-Security-Policy: configured
- Strict-Transport-Security: 1 year

### Performance Optimizations
- Gzip compression enabled
- Static asset caching (1 year for JS/CSS/images)
- No caching for HTML files
- HTTP/2 enabled

### File Upload Support
- `client_max_body_size 10M`
- Extended timeouts (300s) for AI API calls

## Port Configuration

- **Main Nginx**: Port 80 (HTTP) and 443 (HTTPS)
- **Personality Container**: Port 8081 (mapped from internal port 80)
- **Main Backend**: Port 3001

## Access Patterns

### For Users
1. **Main Site**: `https://itica.lat/` → Main React app
2. **Personality on Main**: `https://itica.lat/personality/` → Personality app via proxy
3. **Personality Subdomain**: `https://personality.itica.lat/` → Direct personality app

### For APIs
1. **Main API**: `https://itica.lat/api/` → Backend container (port 3001)
2. **Personality API (Main)**: `https://itica.lat/personality/api/` → Personality container
3. **Personality API (Sub)**: `https://personality.itica.lat/api/` → Personality container

## Deployment Steps

1. **Update DNS**: Ensure `personality.itica.lat` points to your server
2. **SSL Certificate**: Verify certificate covers subdomain
3. **Deploy Containers**:
   ```bash
   # Deploy personality containers with port 8081
   cd /path/to/personality
   docker compose -f docker-compose.prod.yml up -d
   ```
4. **Update Main Nginx**: Replace current nginx.conf with this version
5. **Test Configuration**:
   ```bash
   nginx -t
   nginx -s reload
   ```

## Health Checks

- **Main Site**: `https://itica.lat/health` → Returns "healthy"
- **Personality (Main)**: `https://itica.lat/personality/health` → Proxied to container
- **Personality (Sub)**: `https://personality.itica.lat/health` → Direct to container

## Container Networking

The personality containers must be accessible from the main nginx container via `localhost:8081`. Ensure:

1. Personality containers are running and bound to host port 8081
2. No firewall blocking port 8081
3. Containers are healthy and responding

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Personality container not running or not on port 8081
2. **SSL Errors**: Certificate doesn't cover `personality.itica.lat`
3. **403/404 Errors**: Check container health and port mapping
4. **Timeout Errors**: Verify extended timeout settings are working

### Debug Commands

```bash
# Check container status
docker ps | grep personality

# Test personality container directly
curl http://localhost:8081/health

# Test through nginx
curl https://personality.itica.lat/health

# Check nginx logs
docker logs <nginx-container-name>
```