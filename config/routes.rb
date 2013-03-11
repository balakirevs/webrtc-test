Callee::Application.routes.draw do

  resources :calls do
    member do
      post :answer
    end
  end

  root to: 'pages#index'

end
