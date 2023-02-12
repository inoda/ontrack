FactoryBot.define do
  factory :user do
    username { Faker::Internet.username }
    password  { Faker::Internet.password }
    monthly_goal {  }
    locale { "en-US" }
    currency_iso { "USD" }
  end
end
