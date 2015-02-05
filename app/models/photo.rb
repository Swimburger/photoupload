class Photo < ActiveRecord::Base
  has_many :photos_categories
  has_many :categories, :through => :photos_categories
  has_many :photos_keywords
  has_many :keywords, :through => :photos_keywords

  enum status: [:unreviewed,:approved, :rejected, :no_usage]
end
