# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150203202502) do

  create_table "categories", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "countries", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "keywords", force: :cascade do |t|
    t.string   "word",          limit: 255
    t.boolean  "is_predefined", limit: 1,   default: false
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
  end

  create_table "photos", force: :cascade do |t|
    t.string   "caption",             limit: 255
    t.integer  "year",                limit: 4
    t.string   "people_in_photo",     limit: 255
    t.string   "path",                limit: 255
    t.string   "uploaded_by_name",    limit: 255
    t.string   "uploaded_by_email",   limit: 255
    t.integer  "country_id",          limit: 4
    t.integer  "yfu_organisation_id", limit: 4
    t.integer  "status",              limit: 4,   default: 0
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
  end

  add_index "photos", ["country_id"], name: "index_photos_on_country_id", using: :btree
  add_index "photos", ["yfu_organisation_id"], name: "index_photos_on_yfu_organisation_id", using: :btree

  create_table "photos_categories", force: :cascade do |t|
    t.integer "photo_id",    limit: 4
    t.integer "category_id", limit: 4
  end

  add_index "photos_categories", ["category_id"], name: "index_photos_categories_on_category_id", using: :btree
  add_index "photos_categories", ["photo_id"], name: "index_photos_categories_on_photo_id", using: :btree

  create_table "photos_keywords", force: :cascade do |t|
    t.integer "photo_id",   limit: 4
    t.integer "keyword_id", limit: 4
  end

  add_index "photos_keywords", ["keyword_id"], name: "index_photos_keywords_on_keyword_id", using: :btree
  add_index "photos_keywords", ["photo_id"], name: "index_photos_keywords_on_photo_id", using: :btree

  create_table "yfu_organisations", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

end
