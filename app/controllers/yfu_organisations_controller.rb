class YfuOrganisationsController < ApplicationController
  before_action :set_yfu_organisation, only: [:show, :update, :destroy]

  # GET /yfu_organisations
  # GET /yfu_organisations.json
  def index
    @yfu_organisations = YfuOrganisation.select(:id,:name)

    render json: @yfu_organisations
  end

  # GET /yfu_organisations/1
  # GET /yfu_organisations/1.json
  def show
    render json: @yfu_organisation
  end

  # POST /yfu_organisations
  # POST /yfu_organisations.json
  def create
    @yfu_organisation = YfuOrganisation.new(yfu_organisation_params)

    if @yfu_organisation.save
      render json: @yfu_organisation, status: :created, location: @yfu_organisation
    else
      render json: @yfu_organisation.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /yfu_organisations/1
  # PATCH/PUT /yfu_organisations/1.json
  def update
    @yfu_organisation = YfuOrganisation.find(params[:id])

    if @yfu_organisation.update(yfu_organisation_params)
      head :no_content
    else
      render json: @yfu_organisation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /yfu_organisations/1
  # DELETE /yfu_organisations/1.json
  def destroy
    @yfu_organisation.destroy

    head :no_content
  end

  private

    def set_yfu_organisation
      @yfu_organisation = YfuOrganisation.select(:id,:name).find(params[:id])
    end

    def yfu_organisation_params
      params.require(:yfu_organisation).permit(:name)
    end
end
