class PhotosKeyword < ActiveRecord::Base
  belongs_to :photo
  belongs_to :keyword
end
