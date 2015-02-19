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

ActiveRecord::Schema.define(version: 20150211195011) do

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
    t.string   "uploaded_by_name",    limit: 255
    t.string   "uploaded_by_email",   limit: 255
    t.datetime "upload_date"
    t.string   "image_file_name",     limit: 255
    t.string   "image_content_type",  limit: 255
    t.integer  "image_file_size",     limit: 4
    t.datetime "image_updated_at"
    t.decimal  "height",                          precision: 10
    t.decimal  "width",                           precision: 10
    t.integer  "country_id",          limit: 4
    t.integer  "yfu_organization_id", limit: 4
    t.integer  "status",              limit: 4,                  default: 0
    t.datetime "created_at",                                                 null: false
    t.datetime "updated_at",                                                 null: false
  end

  add_index "photos", ["country_id"], name: "index_photos_on_country_id", using: :btree
  add_index "photos", ["yfu_organization_id"], name: "index_photos_on_yfu_organization_id", using: :btree

  create_table "photos_categories", force: :cascade do |t|
    t.integer  "photo_id",    limit: 4, null: false
    t.integer  "category_id", limit: 4, null: false
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_index "photos_categories", ["category_id"], name: "index_photos_categories_on_category_id", using: :btree
  add_index "photos_categories", ["photo_id", "category_id"], name: "index_photos_categories_on_photo_id_and_category_id", unique: true, using: :btree
  add_index "photos_categories", ["photo_id"], name: "index_photos_categories_on_photo_id", using: :btree

  create_table "photos_keywords", force: :cascade do |t|
    t.integer  "photo_id",   limit: 4, null: false
    t.integer  "keyword_id", limit: 4, null: false
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "photos_keywords", ["keyword_id"], name: "index_photos_keywords_on_keyword_id", using: :btree
  add_index "photos_keywords", ["photo_id", "keyword_id"], name: "index_photos_keywords_on_photo_id_and_keyword_id", unique: true, using: :btree
  add_index "photos_keywords", ["photo_id"], name: "index_photos_keywords_on_photo_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.integer  "roles_mask",             limit: 4
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "yfu_organizations", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

end
