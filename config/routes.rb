Callee::Application.routes.draw do

  resources :people, only: [:new, :create] do
    collection do
      get :me
    end
  end
  resources :calls
  resources :client_signals, only: [:index, :create]

  root to: 'people#new'

end
