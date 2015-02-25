class PhotosController < ApiController
  before_action :set_photo, only: [:show, :update, :destroy]
  load_and_authorize_resource :except => [:file,:file_by_id]

  # GET /photos
  # GET /photos.json
  def index
    @photos = Photo.select(
        :id,
        :caption,
        :year,
        :people_in_photo,
        :image_file_name,
        :image_content_type,
        :image_file_size,
        :upload_date,
        :uploaded_by_name,
        :uploaded_by_email,
        :height,
        :width,
        :country_id,
        :yfu_organization_id,
        :status
    ).where!('image_file_name IS NOT NULL')

    if current_user.has_role? :admin
    elsif current_user.has_role? :reader
      @photos.where!(status: 1)
    end

    render json: @photos
  end

  # GET /photos/1
  # GET /photos/1.json
  def show
    if current_user.has_role? :admin
    elsif (current_user.has_role? :reader) && !@photo.approved?
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    render json: @photo
  end



  # PATCH/PUT /photos/1
  # PATCH/PUT /photos/1.json
  def update
    @photo = Photo.find(params[:id])
    if @photo.update(photo_params)
      if params.has_key? :keywords
        PhotosKeyword.destroy_all(photo_id:params[:id])
        if !params[:keywords].nil?
          params[:keywords].each { |keyword | PhotosKeyword.create(photo_id:params[:id],keyword_id:keyword[:id])}
        end
      end
      if params.has_key? :categories
        PhotosCategory.destroy_all(photo_id:params[:id])
        if !params[:categories].nil?
          params[:categories].each { |category|  PhotosCategory.create(photo_id:params[:id],category_id:category[:id])}
        end
      end
      head :no_content
    else
      render json: @photo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /photos/1
  # DELETE /photos/1.json
  def destroy
    @photo.destroy

    head :no_content
  end

  # /photos/file/:size/:filename.:format
  def file
    if !user_signed_in?
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    photo = Photo.select(
        :id,
        :image_file_name,
        :image_content_type,
        :image_file_size,
        :status
    ).find_by(image_file_name: params[:image_name] + '.' + params[:format])
    if current_user.has_role? :admin #a user could have a reader and admin role, so ignore being a reader if you're an admin
    elsif (current_user.has_role? :reader) && !photo.approved?
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    path = photo.image.path(params[:size])
    send_file path, :type => photo.image_content_type, :disposition => 'inline'
  end

  # /photos/:id/file/:size/
  def file_by_id
    if !user_signed_in?
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    photo = Photo.select(
        :id,
        :image_file_name,
        :image_content_type,
        :image_file_size,
        :status
    ).find(params[:id])
    puts photo.approved?.to_s
    if current_user.has_role? :admin #a user could have a reader and admin role, so ignore being a reader if you're an admin
    elsif (current_user.has_role? :reader) && !photo.approved?
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    path = photo.image.path(params[:size])
    send_file path, :type => photo.image_content_type, :disposition => 'inline'
  end

  private

  # POST /photos
  # POST /photos.json
  def create
    @photo = Photo.new(photo_params)

    if @photo.save
      render json: @photo, status: :created, location: @photo
    else
      render json: @photo.errors, status: :unprocessable_entity
    end
  end

  def set_photo
    @photo = Photo.select(
        :id,
        :caption,
        :year,
        :people_in_photo,
        :image_file_name,
        :image_content_type,
        :image_file_size,
        :height,
        :width,
        :upload_date,
        :uploaded_by_name,
        :uploaded_by_email,
        :country_id,
        :yfu_organization_id,
        :status
    ).find(params[:id])
  end

  def photo_params
    params.permit(
        :caption,
        :year,
        :people_in_photo,
        :country_id,
        :yfu_organization_id,
        :status
    )
  end
end
