DISCLAIMER: I am not very familiar with Docker so please create a PR if something looks weird!

#### Development
- Run `docker-compose run web rake db:setup` to migrate the DB
- Run `docker-compose up`

#### Production
- Add the following to docker-compose.yml:

```
RAILS_ENV=production
RAILS_SERVE_STATIC_FILES=true
RAILS_LOG_TO_STDOUT=true
DATABASE_URL=<your DB URL here>
SECRET_KEY_BASE=<your secret key here>
```
