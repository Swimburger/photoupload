class PhotoFormController < ActionController::Base
  def index
  end

  def upload
    name = params[:name]
    email = params[:email]
    people = params[:people]
    caption = params[:caption]
    year = params[:year]
    begin
      categories = explode(params[:categories],',').map { |category| Category.find_by_name(category)}
      keywords = explode(params[:keywords],',').map { |keyword| Keyword.find_or_create_by!(word:keyword)}
      country = Country.find_by_name(params[:country])
      organization = YfuOrganization.find_by_name(params[:organization])

      photo = Photo.create!(
                       uploaded_by_name:name,
                       uploaded_by_email:email,
                       caption:caption,
                       year:year,
                       people_in_photo:people,
                       upload_date:DateTime.now,
                       country_id:country.id,
                       yfu_organization_id:organization.id,
                       categories:categories,
                       keywords:keywords,
                       image:params[:file]
      )
      puts photo
    rescue ActiveRecord::RecordInvalid => e
      puts '////ERROR when trying to create photo/////',e.message
      render json: {error_message:e.message}, status: :not_acceptable
    else
      render json: photo, status: :created
    end
  end
  private
  def explode(text,sep)
    parts = text.split(sep)
    parts.map { |part| part.strip}
  end
end
