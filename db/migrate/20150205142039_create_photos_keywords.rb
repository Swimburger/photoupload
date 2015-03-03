class CreatePhotosKeywords < ActiveRecord::Migration
  def change
    create_table :photos_keywords do |t|
      t.belongs_to :photo, index: true, null: false
      t.belongs_to :keyword, index: true, null: false

      t.timestamps null: false
    end

    add_index :photos_keywords, [:photo_id,:keyword_id], :unique => true
  end
end
