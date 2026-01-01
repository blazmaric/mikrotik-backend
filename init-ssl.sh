#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./init-ssl.sh <domain>"
  echo "Example: ./init-ssl.sh api.m-host.si"
  exit 1
fi

DOMAIN=$1
echo "Obtaining SSL certificate for: $DOMAIN"

# Create directories
mkdir -p certbot/conf/live/$DOMAIN
mkdir -p certbot/www

# Check if real certificates already exist
if [ -f "certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
  echo "Certificates already exist for $DOMAIN"
  CERTS_EXIST=true
else
  echo "Creating temporary self-signed certificate..."
  CERTS_EXIST=false
  
  # Create self-signed certificate
  docker run --rm -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    certbot/certbot:latest \
    sh -c "mkdir -p /etc/letsencrypt/live/$DOMAIN && \
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
    -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
    -subj '/CN=localhost'"
fi

# Start nginx with temporary/existing certificates
echo "Starting nginx..."
docker compose up -d nginx
sleep 3

# If certificates were temporary, get real ones
if [ "$CERTS_EXIST" = false ]; then
  echo "Obtaining Let's Encrypt certificate..."
  
  # Remove temporary certificates
  rm -rf certbot/conf/live/$DOMAIN
  rm -rf certbot/conf/archive/$DOMAIN
  rm -rf certbot/conf/renewal/$DOMAIN.conf
  
  # Get real certificate
  docker compose run --rm certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@m-host.si \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"
  
  if [ $? -eq 0 ]; then
    echo "SSL certificate obtained successfully!"
    echo "Reloading nginx with new certificate..."
    docker compose exec nginx nginx -s reload
    echo "Done!"
  else
    echo "Failed to obtain SSL certificate"
    exit 1
  fi
else
  echo "Using existing certificates. Run with --force-renewal to renew."
fi
