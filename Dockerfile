FROM ruby:3.1.2-alpine

WORKDIR /ontrack

COPY . .

RUN apk add --no-cache build-base postgresql-dev yarn && \
    yarn install --non-interactive --check-files && \
    gem install bundler && \
    bundle update

EXPOSE 3000

ENTRYPOINT [ "/ontrack/entrypoint.sh" ] 
