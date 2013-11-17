FinalProj::Application.routes.draw do

  devise_for :users
  root :to => 'cabals#index'
	
	get '/cabals', to: "cabals#index", as: "cabals"
	get '/cabals/:id', to: "cabals#show", as: "cabal"
	post '/cabals/:id/users', to: "cabals#add_member", as: "add_cabal_member"
	get '/newcabal', to: "cabals#new", as: "new_cabal"
	post '/newcabal', to: "cabals#create", as: "create_cabal"

  resources :messages, only: [:create]
  resources :pinpoints, only: [:create, :destroy]
	get '/cabals/:id/sync', to: "cabals#sync", as: "sync_cabal"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
