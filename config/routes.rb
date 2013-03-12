Callee::Application.routes.draw do

  resources :people, only: [:new, :create, :show, :index]
  resources :calls
  resources :client_signals, only: [:index, :create]

  root to: 'people#new'

end
