module Api; module V1
  class CategoriesController < BaseController
    def index
      render json: ::Category.all.order(:id)
    end

    def create
      category = ::Category.new(color: params[:color], name: params[:name], annual_goal: params[:goal])
      successful = category.save
      render json: category, status: successful ? 200 : 500
    end

    def update
      category = ::Category.find(params[:id])
      successful = category.update(color: params[:color], name: params[:name], annual_goal: params[:goal])
      render json: category, status: successful ? 200 : 500
    end
  end
end; end
