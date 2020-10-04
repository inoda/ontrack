class User < ApplicationRecord
  # Available devise modules:
  # :confirmable, :lockable, :registerable, :trackable, :omniauthable, :validatable
  devise :database_authenticatable, :recoverable, :rememberable, :timeoutable

  validates :username, presence: true, uniqueness: { case_sensitive: false }
end
