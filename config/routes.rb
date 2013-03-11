Callee::Application.routes.draw do

  resources :calls
  resources :client_signals

  root to: 'pages#index'

end
