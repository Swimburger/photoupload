Rails.application.routes.draw do
  get 'admin/index'

  devise_for :users, :skip => [:registrations]
  as :user do
    get 'users/edit' => 'devise/registrations#edit', :as => 'edit_user_registration'
    put 'users' => 'devise/registrations#update', :as => 'user_registration'
  end

  get '/', to:'photo_form#index'

  post 'upload_photo', to:'photo_form#upload'

  scope '/api' do
    resources :yfu_organizations, except: [:new, :edit]
    resources :categories, except: [:new, :edit]
    resources :keywords, except: [:new, :edit]
    resources :countries, except: [:new, :edit]
    resources :photos, except: [:new, :edit]
    get '/photos/file/:size/:image_name', to:'photos#file'
    resources :photos_categories, except: [:new, :edit]
    resources :photos_keywords, except: [:new, :edit]
  end
end
