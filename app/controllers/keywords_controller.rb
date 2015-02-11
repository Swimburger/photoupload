require 'wannabe_bool'
class KeywordsController < ApiController
  before_action :set_keyword, only: [:show, :update, :destroy]
  load_and_authorize_resource

  # GET /keywords
  # GET /keywords.json
  def index
    @keywords = Keyword.select(:id,:word, :is_predefined)
    if(params.has_key? :is_predefined)
      @keywords.where!(is_predefined:params[:is_predefined].to_b)
    end
    render json: @keywords
  end

  # GET /keywords/1
  # GET /keywords/1.json
  def show
    render json: @keyword
  end

  # POST /keywords
  # POST /keywords.json
  def create
    @keyword = Keyword.new(keyword_params)

    if @keyword.save
      render json: @keyword, status: :created, location: @keyword
    else
      render json: @keyword.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /keywords/1
  # PATCH/PUT /keywords/1.json
  def update
    @keyword = Keyword.find(params[:id])

    if @keyword.update(keyword_params)
      head :no_content
    else
      render json: @keyword.errors, status: :unprocessable_entity
    end
  end

  # DELETE /keywords/1
  # DELETE /keywords/1.json
  def destroy
    @keyword.destroy

    head :no_content
  end

  private

    def set_keyword
      @keyword = Keyword.select(:id,:word,:is_predefined).find(params[:id])
    end

    def keyword_params
      params.require(:keyword).permit(:word, :is_predefined)
    end
end
