FactoryBot.define do
  factory :user do
    username { Faker::Internet.username }
    password  { Faker::Internet.password }
    monthly_goal {  }
  end
end
