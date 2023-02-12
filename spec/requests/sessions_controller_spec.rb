require 'rails_helper'

describe SessionsController, type: :request do
  before(:each) do
    # cleanup users table because login supports only first user
    User.destroy_all
  end

  describe "GET /" do
    it "renders #new" do
      get '/'
      expect(response.status).to eq(200)
    end
  end

  describe "POST /sessions" do
    context "with empty users table" do
      it "redirects to root with the error message" do
        post '/sessions'

        expect(response.status).to eq(302)
        expect(flash[:error]).to eq("No user found")
      end
    end

    context "with user record" do
      let(:decoded_username) { Faker::Internet.username }
      let(:decoded_password) { Faker::Internet.password }
      let!(:user) { create(:user, username: decoded_username, password: decoded_password) }

      it "redirects to root with the error message for empty params" do
        post '/sessions'

        expect(response.status).to eq(302)
        expect(flash[:error]).to eq("Incorrect login")
      end

      it "redirects to root with the error message for empty params" do
        post '/sessions', params: { username: Faker::Internet.username, password: Faker::Internet.password }

        expect(response.status).to eq(302)
        expect(flash[:error]).to eq("Incorrect login")
      end

      it "creates session and sets cookies for correct username and password" do
        post '/sessions', params: { username: decoded_username, password: decoded_password }

        expect(response.status).to eq(302)

        expect(cookies[:locale]).to eq user.locale
        expect(cookies[:currency_iso]).to eq user.currency_iso
        expect(session[:current_user_id]).to eq user.id
      end
    end
  end

  describe "GET /sessions/logout" do
    it "redirects" do
      get '/sessions/logout'

      expect(response.status).to eq(302)
    end
  end
end
