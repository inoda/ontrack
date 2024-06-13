## Local development with Docker

### Building docker container

```bash
docker build --rm --compress -t inoda/ontrack .
```

### Using docker-compose

```bash
SECRET_KEY_BASE="change_me" POSTGRES_PASSWORD="change_me" docker-compose up -d
```

### Running

```bash
docker run --rm -d \
  -e "POSTGRESQL_DATABASE=ontrack" \
  -e "POSTGRESQL_USERNAME=ontrack" \
  -e "POSTGRESQL_PASSWORD=change_me" \
  --name "ontrack-db" \
  postgres

docker run --rm -d \
  --link "ontrack-postgres" \
  -e "DATABASE_URL=postgres://ontrack:change_me@ontrack-postgres/ontrack" \
  -e "RAILS_ENV=development" \
  -p 3000:3000 \
  inoda/ontrack
```

## Production with Docker, reverse-proxy and SSL

You must replace `ontrack.exemple` by your own domain name.

### Using docker-compose

Generate SSL certificate with certbot: (Don't forget to configure DNS before)
```bash
docker run -it --rm --name certbot -v "/etc/letsencrypt:/etc/letsencrypt" -p "80:80" certbot/certbot certonly --standalone --agree-tos -d "ontrack.exemple"
```

Or put you own in `/etc/letsencrypt` as following:
```
/etc/letsencrypt
├── live
│  ├── ontrack.exemple
│  │  ├── fullchain.pem # ssl_certificate
└  └  └── privkey.pem   # ssl_certificate_key
```

Then run:

```bash
SERVER_NAME="ontrack.exemple" SECRET_KEY_BASE="change_me" POSTGRES_PASSWORD="change_me" docker-compose -f docker-compose.production.yml up -d
```