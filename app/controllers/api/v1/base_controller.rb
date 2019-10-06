module Api; module V1
  class BaseController < ApplicationController
    def paginate(query, json_opts = {})
      page = query.page
      per_page = query.per_page
      total = query.total_items
      total_pages = query.total_pages
      items = query

      render json: { page: page, per_page: per_page, total: total, items: items.as_json(json_opts), total_pages: total_pages }
    end
  end
end; end
