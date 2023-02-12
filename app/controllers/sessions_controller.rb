class SessionsController < ApplicationController
  skip_before_action :redirect_to_login, only: [:new, :create]
  before_action :redirect_to_dashboard, only: [:new, :create], if: :current_user

  def new
  end

  def create
    user = User.first

    unless user
      flash[:error] = "No user found"
      return redirect_to :root
    end

    if BCrypt::Password.new(user.password) == params[:password] && BCrypt::Password.new(user.username) == params[:username]
      session[:current_user_id] = user.id
      cookies[:currency_iso] = user.currency_iso
      cookies[:locale] = user.locale
    else
      flash[:error] = "Incorrect login"
    end

    redirect_to :root
  end

  def logout
    reset_session
    redirect_to root_path, notice: "Signed out."
  end
end
