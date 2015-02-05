class CreatePhotosCategories < ActiveRecord::Migration
  def change
    create_table :photos_categories do |t|
      t.belongs_to :photo, index: true
      t.belongs_to :category, index: true
      t.timestamps null: false
    end
  end
end
