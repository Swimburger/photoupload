class CreateKeywords < ActiveRecord::Migration
  def change
    create_table :keywords do |t|
      t.string :word
      t.boolean :is_predefined, :default => false

      t.timestamps null: false
    end
  end
end
