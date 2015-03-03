class PhotosKeywordsController < ApiController
  before_action :set_photos_keyword, only: [:show, :update, :destroy]
  load_and_authorize_resource

  # GET /photos_keywords
  # GET /photos_keywords.json
  def index
    @photos_keywords = PhotosKeyword.select(:id,:photo_id,:keyword_id)

    if current_user.has_role? :admin
    elsif current_user.has_role? :reader
      @photos_keywords = @photos_keywords.joins(:photo).where('photos.status = ?', Photo.statuses[:approved])
    end

    if params.has_key? 'photo_id'
      @photos_keywords.where!(photo_id:params[:photo_id])
    end

    render json: @photos_keywords
  end

  # GET /photos_keywords/1
  # GET /photos_keywords/1.json
  def show
    if current_user.has_role? :admin
    elsif (current_user.has_role? :reader) && !@photos_keyword.photo.approved?
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    render json: @photos_keyword
  end

  # POST /photos_keywords
  # POST /photos_keywords.json
  def create
    @photos_keyword = PhotosKeyword.new(photos_keyword_params)

    if @photos_keyword.save
      render json: {id:@photos_keyword.id,
                    photo_id:@photos_keyword.photo_id,
                    keyword_id:@photos_keyword.keyword_id}, status: :created, location: @photos_keyword
    else
      render json: @photos_keyword.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /photos_keywords/1
  # PATCH/PUT /photos_keywords/1.json
  def update
    @photos_keyword = PhotosKeyword.find(params[:id])

    if @photos_keyword.update(photos_keyword_params)
      head :no_content
    else
      render json: @photos_keyword.errors, status: :unprocessable_entity
    end
  end

  # DELETE /photos_keywords/1
  # DELETE /photos_keywords/1.json
  def destroy
    @photos_keyword.destroy

    head :no_content
  end

  private

    def set_photos_keyword
      if params.has_key? :id
        @photos_keyword = PhotosKeyword.select(:id,:photo_id,:keyword_id).find(params[:id])
      elsif params.has_key?(:photo_id) && params.has_key?(:keyword_id)
        @photos_keyword = PhotosKeyword.select(:id,:photo_id,:keyword_id).find_by(photo_id:params[:photo_id],keyword_id:params[:keyword_id])
      end
    end

    def photos_keyword_params
      params.permit(:photo_id, :keyword_id)
    end
end
