Callee::Application.routes.draw do

  resources :people, only: [:new, :create] do
    collection do
      get :me
    end
    member do
      get :call
    end
  end
  resources :calls do
    member do
      get :answer
      get :hangup
    end
  end
  resources :client_signals, only: [:index, :create]

  root to: 'people#new'

end
