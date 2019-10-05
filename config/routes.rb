Rails.application.routes.draw do
  root to: "sessions#new"

  resources :sessions, only: [:new, :create] do
    delete :destroy, on: :collection
  end
  
  resources :dashboard, only: [:index]

  namespace :api do
    namespace :v1 do
      resources :expenses, only: [:index, :create]
      resources :categories, only: [:index, :create, :update]
    end
  end
end
