class Keyword < ActiveRecord::Base
  has_many :photos_keywords
  has_many :photos, :through => :photos_keywords
end
