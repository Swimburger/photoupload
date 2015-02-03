class Photo < ActiveRecord::Base
  has_and_belongs_to_many :categories
  has_and_belongs_to_many :keywords

  enum status: [:unreviewed,:approved, :rejected, :no_usage]
end
