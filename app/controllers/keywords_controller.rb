class KeywordsController < ApplicationController
  before_action :set_keyword, only: [:show, :update, :destroy]

  # GET /keywords
  # GET /keywords.json
  def index
    @keywords = Keyword.all

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
      @keyword = Keyword.find(params[:id])
    end

    def keyword_params
      params.require(:keyword).permit(:word)
    end
end
