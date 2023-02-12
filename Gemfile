source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.6'

gem 'rails', '~> 6.1'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 4.3.12'
gem 'sass-rails', '~> 5'
gem 'webpacker', '~> 6.0.0.beta.2'
gem 'bcrypt', '~> 3.1.7'
gem 'chronic', '~> 0.10.2'
gem 'bootsnap', '>= 1.4.2', require: false

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'pry', '~> 0.13.1'
end

group :test do
  gem "factory_bot_rails", "~> 6.2.0"
  gem 'rspec-rails', '~> 6.0.1'
  gem 'faker', '~> 2.22.0'
end

gem 'tzinfo-data'
