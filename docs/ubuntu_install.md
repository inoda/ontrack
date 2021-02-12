#### Install dependencies
- Run `sudo apt install yarn` or `npm install -g yarn` to install yarn. If you run into `error Couldn't find an integrity file `, run `yarn install --check-files` and try again.
- Make sure you have postgres-dev-server installed. eg. `sudo apt install postgresql-server-dev-11` if you use Postgres 11.

#### Install Ruby
- Install `rbenv`(rbenv is the 'nvm' version of Ruby. It makes it easier to install or update Ruby versions. If you don't mind, you can run `snap install ruby 2.6.6` to skip the steps below)
  - `sudo apt install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev`- Install rbenv dependencies
  - `git clone https://github.com/rbenv/rbenv.git ~/.rbenv` - Install rbenv
  - `echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc` - Add rbenv to path
  - `echo 'eval "$(rbenv init -)"' >> ~/.bashrc`- Makes sure rbenv loads automatically
  - `source ~/.bashrc`- Apply changes to current bash session
- Install `ruby-build`
  - `git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build`
- Install ruby 2.6.6
  - `rbenv install 2.6.6`
  - `rbenv global 2.6.6` - set it as the default
- Install bundler + dependencies
  - `gem install bundler`
  - `bundle install`
  - `bundle exec rake db:create`
  - `bundle exec rake db:migrate`
- Starting the server
  - Run `sh scripts.sh start`
  - Visit http://localhost:3000
