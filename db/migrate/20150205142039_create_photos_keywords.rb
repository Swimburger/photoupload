#TODO: Optimize all models with indexes and restrictions
class CreatePhotosKeywords < ActiveRecord::Migration
  def change
    create_table :photos_keywords do |t|
      t.belongs_to :photo, index: true
      t.belongs_to :keyword, index: true
      t.timestamps null: false
    end
  end
end
