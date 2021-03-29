class ApplicationController < ActionController::Base
  before_action :require_login

  helper_method :current_user

  def current_user
    return false if !cookies.signed[:logged_in]
    true
  end

  def require_login
    redirect_to root_path and return if !current_user
  end

  def require_no_login
    redirect_to dashboard_index_path and return if current_user
  end
end
