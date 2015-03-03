class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
      t.string :name
      t.boolean :show_in_form, :default => false
      t.timestamps null: false
    end
  end
end
