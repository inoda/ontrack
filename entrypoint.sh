#!/bin/bash
rails db:migrate
./bin/webpack
bundle exec rails server -b 0.0.0.0
