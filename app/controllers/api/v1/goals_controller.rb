module Api; module V1
  class GoalsController < BaseController
    def index
      user = ::User.first
      render json: { monthly: user.monthly_goal }
    end

    def update
      user = ::User.first
      successful = user.update(monthly_goal: params[:monthly_goal])
      render json: { monthly: user.monthly_goal }, status: successful ? 200 : 500
    end
  end
end; end
