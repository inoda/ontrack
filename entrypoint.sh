#!/bin/bash
bundle install
yarn install --check-files

# bundle exec rake db:create
# bundle exec rake db:migrate

./bin/webpack \
  & bundle exec rails server -b 0.0.0.0
