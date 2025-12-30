#!/bin/bash

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Get SSL certificate
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@m-host.si \
  --agree-tos \
  --no-eff-email \
  -d api.m-host.si

# Reload nginx (if running)
if docker compose ps nginx | grep -q 'Up'; then
  docker compose exec nginx nginx -s reload
else
  echo "Nginx is not running yet, skipping reload"
fi

echo "SSL certificate obtained successfully!"
echo "Now restart the containers: docker compose down && docker compose up -d"
