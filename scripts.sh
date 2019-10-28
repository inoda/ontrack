#!/bin/bash
install_rails () {
	echo "INSTALLING BUNDLER"
	gem install bundler
	echo "CREATING DATABASE"
	bundle exec rake db:create
}

start_server () {
	echo "INITIALIZING RUBY VERSION MANAGER"
	eval "$(rbenv init -)"
	echo "INSTALLING GEMS"
	bundle install
	echo "INSTALLING JS PACKAGES"
	yarn install
	echo "ENSURING DATABASE IS MIGRATED"
	bundle exec rake db:migrate
	echo "STARTING SERVER AT PORT 3000"
	bundle exec rails s
}

if [ "$1" == "start" ]
then
	start_server
fi

if [ "$1" == "install_with_brew" ]
then
	echo "INSTALLING RUBY VERSION MANAGER"
	brew install rbenv ruby-build || (echo "brew install rbenv ruby-build failed - continuing")
	echo "INITIALIZING RUBY VERSION MANAGER"
	eval "$(rbenv init -)"
	rbenv install 2.6.5 || (echo "ruby install failed - continuing")
	install_rails
	start_server
fi

echo "Run with one of the following:"
echo "'install_with_brew' to install dependencies and start your server"
echo "'start' to start your server if initial installation has completed before"
