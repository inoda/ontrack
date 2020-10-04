class User < ApplicationRecord
  # Available devise modules:
  # :confirmable, :lockable, :registerable, :trackable, :omniauthable, :validatable
  devise :database_authenticatable, :recoverable, :rememberable, :timeoutable

  validates :username, presence: true, uniqueness: { case_sensitive: false }

  protected

    def self.find_for_database_authentication(warden_conditions)
      conditions = warden_conditions.dup
      if username = conditions.delete(:username)
        # TODO: if we ever want to support multiple users, we need to
        #       figure out a way to compare bcrypt hashed usernames
        user = User.first
        if BCrypt::Password.new(user.username) == username.downcase
          user
        else
          nil
        end
      end
    end
end
