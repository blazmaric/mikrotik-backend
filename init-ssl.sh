#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./init-ssl.sh <domain>"
  echo "Example: ./init-ssl.sh api.m-host.si"
  exit 1
fi

DOMAIN=$1
echo "Obtaining SSL certificate for: $DOMAIN"

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Get SSL certificate (force renewal if exists)
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@m-host.si \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN"

if [ $? -eq 0 ]; then
  echo "SSL certificate obtained successfully!"
  
  # Reload nginx (if running)
  if docker compose ps nginx | grep -q 'Up'; then
    echo "Reloading nginx..."
    docker compose exec nginx nginx -s reload
  else
    echo "Nginx is not running yet, skipping reload"
  fi
  
  echo "Done! If nginx is not running, start it with: docker compose up -d"
else
  echo "Failed to obtain SSL certificate"
  exit 1
fi
