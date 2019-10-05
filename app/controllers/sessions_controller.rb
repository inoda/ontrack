class SessionsController < ApplicationController
  skip_before_action :require_login, only: [:new, :create]
  before_action :require_no_login, only: [:new, :create]

  def new
  end

  def create
    user = User.first

    unless user
      raise "hi"
      flash[:error] = "No user found"
      redirect_to :root and return
    end

    if BCrypt::Password.new(user.password) == params[:password] && BCrypt::Password.new(user.username) == params[:username]
      cookies.signed[:logged_in] = true
    else
      raise "by"
      flash[:error] = "Incorrect login"
    end

    redirect_to :root
  end

  def destroy
    cookies.signed[:logged_in] = false
    redirect_to :root
  end
end
