class CountriesController < ApiController
  before_action :set_country, only: [:show, :update, :destroy]
  load_and_authorize_resource

  # GET /countries
  # GET /countries.json
  def index
    @countries = Country.select(:id,:name)
    if params.has_key? :show_in_form
      @countries.where!(show_in_form:params[:show_in_form].to_b)
    end
    render json: @countries
  end

  # GET /countries/1
  # GET /countries/1.json
  def show
    render json: @country
  end

  # POST /countries
  # POST /countries.json
  def create
    @country = Country.new(country_params)

    if @country.save
      render json: {id:@country.id,name:@country.name}, status: :created, location: @country
    else
      render json: @country.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /countries/1
  # PATCH/PUT /countries/1.json
  def update
    @country = Country.find(params[:id])

    if @country.update(country_params)
      head :no_content
    else
      render json: @country.errors, status: :unprocessable_entity
    end
  end

  # DELETE /countries/1
  # DELETE /countries/1.json
  def destroy
    @country.destroy

    head :no_content
  end

  private

    def set_country
      @country = Country.select(:id,:name).find(params[:id])
    end

    def country_params
      params.permit(:name)
    end
end
