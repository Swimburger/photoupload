class CreateYfuOrganizations < ActiveRecord::Migration
  def change
    create_table :yfu_organizations do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
