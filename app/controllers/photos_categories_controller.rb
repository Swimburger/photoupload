class PhotosCategoriesController < ApiController
  before_action :set_photos_category, only: [:show, :update, :destroy]
  load_and_authorize_resource

  # GET /photos_categories
  # GET /photos_categories.json
  def index
    @photos_categories = PhotosCategory.select(:id,:photo_id,:category_id)

    if current_user.has_role? :admin
    elsif current_user.has_role? :reader
      @photos_categories = @photos_categories.joins(:photo).where('photos.status = ?', Photo.statuses[:approved])
    end

    render json: @photos_categories
  end

  # GET /photos_categories/1
  # GET /photos_categories/1.json
  def show
    if current_user.has_role? :admin
    elsif (current_user.has_role? :reader) && !@photos_category.photo.approved?
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    render json: @photos_category
  end

  # POST /photos_categories
  # POST /photos_categories.json
  def create
    @photos_category = PhotosCategory.new(photos_category_params)

    if @photos_category.save
      render json: @photos_category, status: :created, location: @photos_category
    else
      render json: @photos_category.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /photos_categories/1
  # PATCH/PUT /photos_categories/1.json
  def update
    @photos_category = PhotosCategory.find(params[:id])

    if @photos_category.update(photos_category_params)
      head :no_content
    else
      render json: @photos_category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /photos_categories/1
  # DELETE /photos_categories/1.json
  def destroy
    @photos_category.destroy

    head :no_content
  end

  private

    def set_photos_category
      @photos_category = PhotosCategory.select(:id,:photo_id,:category_id).find(params[:id])
    end

    def photos_category_params
      params[:photos_category]
    end
end
