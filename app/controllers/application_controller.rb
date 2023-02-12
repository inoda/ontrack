class ApplicationController < ActionController::Base
  before_action :redirect_to_login, unless: :current_user
  helper_method :current_user

  private

  def current_user
    @current_user ||= session[:current_user_id] && User.find_by(id: session[:current_user_id])
  end

  def user_signed_in?
    @current_user.present?
  end

  def redirect_to_login
    redirect_to root_path
  end

  def redirect_to_dashboard
    redirect_to dashboard_index_path
  end
end
