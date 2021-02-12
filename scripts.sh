#!/bin/bash
install_dependencies () {
	if [[ $(which bundle) ]]
	then
		echo "INSTALLING GEMS"
		bundle install
		echo "INSTALLING JS PACKAGES"
		yarn install
	else
		echo "INSTALLING BUNDLER"
		gem install bundler
		echo "INSTALLING GEMS"
		bundle install
		echo "INSTALLING JS PACKAGES"
		yarn install
	fi
}

setup_db () {
	echo "CREATING DATABASE"
	bundle exec rake db:create
	echo "MIGRATING DATABASE"
	bundle exec rake db:migrate
}

set_ruby_version () {
	if [[ $(ruby -v) =~ "$(cat .ruby-version)" ]]
	then
		echo "You are the preferred Ruby version: $(cat .ruby-version)"
	else
		if [[ $(which rbenv) ]]
		then
			eval "$(rbenv init -)"
		elif [[ $(which rvm) ]]
		then
			rvm $(cat .ruby-version)
		elif [[ $(which chruby) ]]
		then
			chruby $(cat .ruby-version)
		fi
	fi

}

start_server () {
	echo "INITIALIZING RUBY VERSION MANAGER"
	set_ruby_version
	echo "INSTALLING DEPENDENCIES"
	install_dependencies
	echo "SETTING UP DATABASE"
	setup_db
	echo "STARTING SERVER AT PORT 3000"
	bundle exec rails s
}

if [[ "$1" == "start" ]]
then
	start_server
elif [[ "$1" == "install_with_brew" ]]
then
	echo "INSTALLING RUBY VERSION MANAGER"
	brew install rbenv ruby-build || (echo "brew install rbenv ruby-build failed - continuing")
	echo "INITIALIZING RUBY VERSION MANAGER"
	eval "$(rbenv init -)"
	rbenv install 2.6.6 || (echo "ruby install failed - continuing")
	start_server
fi

echo "Run with one of the following:"
echo "'install_with_brew' to install dependencies and start your server"
echo "'start' to start your server if initial installation has completed before"
