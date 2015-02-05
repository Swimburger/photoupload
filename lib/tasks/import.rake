require 'csv'
require 'wannabe_bool'

namespace :import do
  #TODO: write import
  desc 'This imports the old photos from the previous photouploader through a CSV dump'
  task :old_photos,[:force] => [:environment] do |t, args|

    force = args.force.to_b

    puts '/////////////////////////////////forcing import/////////////////////////////////' if force

    CSV.foreach('php_to_ruby_migration/oldphotos.csv',:headers => true) do |row|
      id = row['id']
      uploaded_by_name = row['name']
      uploaded_by_email = row['email']
      organization = row['organization']
      uploaded = DateTime.parse row['uploaded']
      filename = row['filename']
      filetype = row['filetype']
      caption = row['caption']
      country = row['country']
      year = row['year']
      people = row['people']
      keywords = row['keywords']
      @category_hostfamily = row['hostfamily'].to_b
      @category_student = row['student'].to_b
      @category_volunteers = row['volunteers'].to_b
      @category_events = row['events'].to_b
      @category_school = row['school'].to_b
      @category_travel = row['travel'].to_b
      @category_alumni = row['alumni'].to_b

      puts "///////////////////////////////// Photo: #{id}/////////////////////////////////"

      photo = Photo.find_by_id id
      photo_does_not_exist_yet = photo.nil?
      if photo_does_not_exist_yet
        photo = Photo.new
      end

      if photo_does_not_exist_yet || force

        puts '/////////////////////////////////forcing update/////////////////////////////////' if force && !photo_does_not_exist_yet

        country_record = find_country_or_create country
        yfu_organization = find_yfu_organization_or_create organization
        categories = get_categories
        keyword_records = get_keywords keywords

        file = get_photofile id

        if !file.empty?

          puts 'old photo: '+file

          file_name = File.basename(file)

          photo.id=id
          photo.caption=caption
          photo.year=year
          photo.people_in_photo=people
          photo.path=file_name
          photo.upload_date=uploaded
          photo.uploaded_by_name=uploaded_by_name
          photo.uploaded_by_email=uploaded_by_email
          photo.country_id=country_record.id
          photo.yfu_organization_id=yfu_organization.id
          categories.each { |category| photo.categories << category }
          keyword_records.each { |keyword| photo.keywords << keyword }
          photo.to_s
          photo.save!


          new_file = 'private/uploads/images/'+ file_name

          FileUtils.cp(file,new_file)

          puts 'new photo: '+ new_file

          puts 'force: '+force.to_s,'photo_does_not_exist_yet: '+photo_does_not_exist_yet.to_s

          puts 'id: '+ id,'uploaded_by_name: '+ uploaded_by_name, 'uploaded_by_email: ' + uploaded_by_email, 'organization: ' + organization, 'uploaded: ' + uploaded.to_s,
               'filename: ' + filename, 'filetype: ' + filetype, 'caption: ' + caption, 'country: ' + country, 'year: ' + year, 'people: ' + people, 'keywords: ' + keywords,
               'category_hostfamily: ' + @category_hostfamily.to_s, 'category_student: ' + @category_student.to_s, 'category_volunteers: ' + @category_volunteers.to_s,
               'category_events: ' + @category_events.to_s, 'category_school: ' + @category_school.to_s, 'category_travel: ' + @category_travel.to_s, 'category_alumni: ' + @category_alumni.to_s

          puts '/////////////////////////////////photo inserted or updated/////////////////////////////////'
        else
          puts 'no photo file found'
        end


      else

        puts "///////////photo with id: #{id} already exists, if you do want to override this, call 'rake import:old_photos[true]'
///////////"

      end



    end
  end
  def find_country_or_create(name)
    name = name.strip
    return Country.find_or_create_by(name:name)
  end
  def find_yfu_organization_or_create(name)
    name = name.to_s
    name.remove!('YFU') if name.start_with?('YFU')
    name = name.strip
    return YfuOrganization.find_or_create_by(name:name)
  end
  def get_keywords(words_string)
    words_array = words_string.to_s.split(',')
    keywords_array=[]
    words_array.each { |word| keywords_array << find_keyword_or_create(word) }
    return keywords_array
  end
  def find_keyword_or_create(word)
    word = word.strip
    return Keyword.find_or_create_by(word:word)
  end
  def get_categories
    categories = []
    if @category_hostfamily
      categories.push Category.find_by_name 'Host family'
    end
    if @category_student
      categories.push Category.find_by_name 'YFU Students'
    end
    if @category_volunteers
      categories.push Category.find_by_name 'Volunteers'
    end
    if @category_events
      categories.push Category.find_by_name 'Seminars and events'
    end
    if @category_school
      categories.push Category.find_by_name 'School'
    end
    if @category_travel
      categories.push Category.find_by_name 'Travel'
    end
    if @category_alumni
      categories.push Category.find_by_name 'Alumni'
    end
    return categories
  end
  def get_photofile(photo_id)
    files =Dir.glob("php_to_ruby_migration/upload/#{photo_id}*.*")
    if files.size > 1 || files.size < 1
      return ''
    else
      return files[0]
    end
  end
end
