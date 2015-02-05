class Category < ActiveRecord::Base
  has_many :photos_categories
  has_many :photos, :through => :photos_categories
end
