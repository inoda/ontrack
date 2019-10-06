Rails.application.routes.draw do
  root to: "sessions#new"

  resources :sessions, only: [:new, :create] do
    delete :destroy, on: :collection
  end

  resources :dashboard, only: [:index]
  resources :expenses, only: [:index]

  namespace :api do
    namespace :v1 do
      resources :expenses, only: [:index, :create]
      resources :categories, only: [:index, :create, :update]
      resources :goals, only: [:index] do
        put :update, on: :collection
      end
    end
  end
end
