# frozen_string_literal: true

namespace :users do
  desc "Unhash user's username and store it back in the database"
  # quotes required
  # rails "users:unhash_username[money_hogger21]"
  # <money_hogger21> is the username that will be used
  task :unhash_username, [:username] => :environment do |_, args|
    user = User.first
    user.update!(username: args[:username])
    puts "Username updated!"
  end
end
