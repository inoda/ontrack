module Api; module V1
  class CategoriesController < BaseController
    def index
      render json: ::Category.all.order(:name)
    end
  end
end; end
