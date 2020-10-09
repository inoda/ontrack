## Local development with Docker

### Building docker container

```bash
docker build --rm --compress -t inoda/ontrack .
```

### Using docker-compose

```bash
docker-compose up -d
```

### Running

```bash
docker run --rm -d \
  -e "POSTGRESQL_DATABASE=ontrack" \
  -e "POSTGRESQL_USERNAME=ontrack" \
  -e "POSTGRESQL_PASSWORD=secret" \
  --name "ontrack-db" \
  postgres

docker run --rm -d \
  --link "ontrack-postgres" \
  -e "DATABASE_URL=postgres://ontrack:secret@ontrack-postgres/ontrack" \
  -e "RAILS_ENV=development" \
  -p 3000:3000 \
  inoda/ontrack
```