class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :caption
      t.integer :year
      t.string :people_in_photo
      t.string :path
      t.string :uploaded_by_name
      t.string :uploaded_by_email
      t.datetime :upload_date

      t.belongs_to :country, index: true
      t.belongs_to :yfu_organization, index: true

      t.column :status, :integer, default:0

      t.timestamps null: false
    end

    create_table :photos_categories do |t|
      t.belongs_to :photo, index: true
      t.belongs_to :category, index: true
    end

    create_table :photos_keywords do |t|
      t.belongs_to :photo, index: true
      t.belongs_to :keyword, index: true
    end
  end
end
