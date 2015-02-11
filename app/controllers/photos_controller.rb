class PhotosController < ApplicationController
  before_action :set_photo, only: [:show, :update, :destroy]
  load_and_authorize_resource

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
    )

    if @user.has_role? :admin
    elsif @user.has_role? :reader
      @photos.where!(status: :approved)
    end

    render json: @photos
  end

  # GET /photos/1
  # GET /photos/1.json
  def show
    if @user.has_role? :admin
    elsif @user.has_role? :reader && @photo.status != :approved
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    render json: @photo
  end

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

  # PATCH/PUT /photos/1
  # PATCH/PUT /photos/1.json
  def update
    @photo = Photo.find(params[:id])

    if @photo.update(photo_params)
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

  # /photos/file/:size/filename.:format
  def file
    photo = Photo.find_by(image_file_name: params[:image_name] + '.' + params[:format])
    path = photo.image.path(params[:size])
    send_file path, :disposition => 'inline', :x_sendfile => true
  end

  private

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
    params.require(:photo).permit(:caption, :year, :people_in_photo, :path, :country_id, :yfu_organization_id, :status)
  end
end
