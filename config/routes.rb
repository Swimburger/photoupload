Rails.application.routes.draw do
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
