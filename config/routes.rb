Rails.application.routes.draw do
  root to: "sessions#new"

  resources :sessions, only: [:new, :create] do
    get :logout, on: :collection
  end

  resources :dashboard, only: [:index]
  resources :insights, only: [:index]
  resources :expenses, only: [:index]
  resources :expense_uploads, only: [:new] do
    collection do
      post :preview
    end
  end

  namespace :api do
    namespace :v1 do
      resources :expenses, only: [:index, :create, :destroy, :update] do
        collection do
          post :bulk_create
        end
      end
      resources :categories, only: [:index, :create, :update, :destroy]
      resources :reports do
        get :year, on: :collection
        get :month, on: :collection
      end
      resources :goals, only: [:index] do
        put :update, on: :collection
      end
    end
  end

  get "/404", to: "errors#not_found"
  get "/422", to: "errors#not_found"
  get "/500", to: "errors#not_found"
end
