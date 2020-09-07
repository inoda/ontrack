FROM bitnami/ruby:2.6.5-prod

LABEL vendor="inoda" \
  package="ontrack" \
  name="OnTrack" \
  description="A simple self-hosted budgeting app"

RUN apt-get update -y \
  && curl -sL https://deb.nodesource.com/setup_14.x | bash \
  && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    liblzma-dev \
    libpq-dev \
    make \
    nodejs \
    patch \
    ruby-dev \
    zlib1g-dev \
  && npm i -g yarn \
  && gem install \
    bundler \
    pg:1.2.3 \
    nokogiri:1.10.9

WORKDIR /ontrack/app
COPY . .

RUN node -v \
  && yarn -v \
  && yarn install --non-interactive --check-files --frozen-lockfile \
  && bundle install

EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ] 
CMD [ "" ]
