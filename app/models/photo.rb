class Photo < ActiveRecord::Base
  has_attached_file :image, :styles => { :xxlarge => '2000x2000>>', :xlarge => '1500x1500>', :large => '1000x1000>', :medium => '600x600>', :small => '300x300>', :thumb => '100x100>' },
                    :path =>':rails_root/private/uploads/:id_partition/:style/:filename'
  validates_attachment :image, :presence => true,
                       :content_type => { :content_type =>["image/jpeg", "image/gif", "image/png"] },
                       :size => { :in => 0.5..30.megabytes }
  validates :image, dimensions: { width: 600, height: 600 }

  has_many :photos_categories
  has_many :categories, :through => :photos_categories
  has_many :photos_keywords
  has_many :keywords, :through => :photos_keywords

  accepts_nested_attributes_for :categories
  accepts_nested_attributes_for :keywords

  enum status: [:unreviewed,:approved, :rejected, :no_usage]

  after_post_process :save_image_dimensions

  def save_image_dimensions
    geo = Paperclip::Geometry.from_file(image.queued_for_write[:original])
    self.width = geo.width
    self.height = geo.height
  end
end
