class ErrorsController < ApplicationController
  skip_before_action :require_login
  
  def not_found
    render status: 400
  end

  def unacceptable
    render status: 422
  end

  def internal_error
    render status: 500
  end
end
