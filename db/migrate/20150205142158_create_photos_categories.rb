class CreatePhotosCategories < ActiveRecord::Migration
  def change
    create_table :photos_categories do |t|
      t.belongs_to :photo, index: true, null:false
      t.belongs_to :category, index: true, null:false

      t.timestamps null: false
    end

    add_index :photos_categories, [:photo_id,:category_id], :unique => true
  end
end
