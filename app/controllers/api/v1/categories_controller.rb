module Api; module V1
  class CategoriesController < BaseController
    def index
      render json: ::Category.all.order(:name)
    end

    def create
      category = ::Category.new(color: params[:color], name: params[:name], annual_goal: params[:goal])
      render json: category, status: category.save ? 200 : 500
    end
  end
end; end
