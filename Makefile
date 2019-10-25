.DEFAULT_GOAL := instructions

instructions:
	@echo "Run with one of the following: [install_with_brew, start]"

start:
	@echo "\n"
	@echo "ENSURING DATABASE IS MIGRATED"
	@echo "-----------------------------"
	bundle exec rake db:migrate
	@echo "\n"
	@echo "STARTING SERVER AT PORT 3000"
	@echo "----------------------------"
	bundle exec rails s

install_rails:
	@echo "\n"
	@echo "INSTALLING BUNDLER"
	@echo "------------------"
	gem install bundler
	@echo "\n"
	@echo "INSTALLING GEMS"
	@echo "---------------"
	bundle install
	@echo "\n"
	@echo "INSTALLING JS PACKAGES"
	@echo "----------------------"
	yarn install
	@echo "\n"
	@echo "SETTING UP DATABASE"
	@echo "-------------------"
	bundle exec rake db:create
	bundle exec rake db:migrate
	@echo "\n"
	@echo "STARTING SERVER AT PORT 3000"
	@echo "----------------------------"
	bundle exec rails s

install_ruby_with_brew:
	@echo "\n"
	@echo "INSTALLING RUBY VERSION MANAGER"
	@echo "-------------------------------"
	brew install rbenv ruby-build || (echo "brew install rbenv ruby-build failed - continuing")
	@echo "\n"
	@echo "INITIALIZING RUBY VERSION MANAGER"
	@echo "---------------------------------"
	rbenv init -
	@echo "\n"
	@echo "INSTALLING RUBY"
	@echo "---------------"
	rbenv install 2.6.0 || (echo "rbenv install 2.6.0 failed - continuing")

install_with_brew: install_ruby_with_brew install_rails
