#TODO: Optimize all models with indexes and restrictions
class CreatePhotosKeywords < ActiveRecord::Migration
  def change
    create_table :photos_keywords do |t|
      t.belongs_to :photo, index: true, null: false
      t.belongs_to :keyword, index: true, null: false

      t.timestamps null: false
      #TODO: add required
    end

    add_index :photos_keywords, [:photo_id,:keyword_id], :unique => true
  end
end
