# RESOURCES USED:
# https://blog.codeship.com/running-rails-development-environment-docker
# https://rubyinrails.com/2019/03/29/dockerify-rails-6-application-setup
# https://www.engineyard.com/blog/using-docker-for-rails
# https://docs.docker.com/compose/rails
# https://www.firehydrant.io/blog/developing-a-ruby-on-rails-app-with-docker-compose

FROM ruby:2.6.5

# Install apt based dependencies required to run Rails as
# well as RubyGems. As the Ruby image itself is based on a
# Debian image, we use apt-get to install those.
RUN apt-get update -qq && apt-get install -y build-essential nodejs

# Configure the main working directory. This is the base
# directory used in any further RUN, COPY, and ENTRYPOINT
# commands.
RUN mkdir -p /app
WORKDIR /app


RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -y nodejs

# Copy the Gemfile as well as the Gemfile.lock and install
# the RubyGems. This is a separate step so the dependencies
# will be cached unless changes to one of those two files
# are made.
COPY Gemfile Gemfile.lock package.json yarn.lock ./
RUN gem install bundler && bundle install --jobs 20 --retry 5
RUN npm install -g yarn
# https://stackoverflow.com/questions/41942769/issue-to-node-sass-and-docker
RUN npm rebuild node-sass
RUN yarn install

# Copy the main application.
COPY . ./

# Expose port 3000 to the Docker host, so we can access it
# from the outside.
EXPOSE 3000

# The main command to run when the container starts. Also
# tell the Rails dev server to bind to all interfaces by
# default.
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
