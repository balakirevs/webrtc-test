Callee::Application.routes.draw do

  resources :calls
  resources :client_signals, only: [:index, :create]

  root to: 'pages#index'

end
