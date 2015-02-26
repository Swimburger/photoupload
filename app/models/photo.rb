# This model holds the data for a photo
class Photo < ActiveRecord::Base
  # see: https://github.com/thoughtbot/paperclip
  # adds the image attribute, resizes images and defines path patter
  has_attached_file :image, :styles => { :xxlarge => '2000x2000>>', :xlarge => '1500x1500>', :large => '1000x1000>', :medium => '600x600>', :small => '300x300>', :thumb => '100x100>' },
                    :path =>':rails_root/private/uploads/:id_partition/:style/:filename'

  # validates the presence of the image, the content type and the size
  validates_attachment :image, :presence => true,
                       :content_type => { :content_type =>["image/jpeg", "image/gif", "image/png"] },
                       :size => { :in => 0.5..30.megabytes }

  # validates that the image height or width is bigger than 600
  validates :image, dimensions: { width: 600, height: 600 }

  #many to many relation with categories
  has_many :photos_categories
  has_many :categories, :through => :photos_categories

  #many to many relation with keywords
  has_many :photos_keywords
  has_many :keywords, :through => :photos_keywords

  accepts_nested_attributes_for :categories
  accepts_nested_attributes_for :keywords

  #the status of the photo
  enum status: [:unreviewed,:approved, :rejected, :no_usage]

  #makes sure that the width and height of the original image is being saved in the database
  after_post_process :save_image_dimensions

  #saves the original image height and width
  def save_image_dimensions
    geo = Paperclip::Geometry.from_file(image.queued_for_write[:original])
    self.width = geo.width
    self.height = geo.height
  end
end
