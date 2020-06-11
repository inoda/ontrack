FROM bitnami/ruby:2.6.5

LABEL name="OnTrack"
LABEL description="A simple self-hosted budgeting app"

RUN apt-get update -y \
  && curl -sL https://deb.nodesource.com/setup_14.x | bash \
  && apt-get install -y \
    libpq-dev \
    gcc \
    g++ \
    make \
    nodejs \
  && npm i -g yarn \
  && gem install bundler \
  && gem install pg -v '1.2.3'

WORKDIR /ontrack/app
COPY . .

RUN node -v \
  && yarn -v \
  && yarn install --non-interactive --check-files \
  && bundle install

EXPOSE 3000

ENTRYPOINT [ "bundle", "exec", "rails", "server", "-b", "0.0.0.0" ] 
CMD [ "" ]
