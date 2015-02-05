class YfuOrganizationsController < ApplicationController
  before_action :set_yfu_organization, only: [:show, :update, :destroy]

  # GET /yfu_organizations
  # GET /yfu_organizations.json
  def index
    @yfu_organizations = YfuOrganization.select(:id,:name)

    render json: @yfu_organizations
  end

  # GET /yfu_organizations/1
  # GET /yfu_organizations/1.json
  def show
    render json: @yfu_organization
  end

  # POST /yfu_organizations
  # POST /yfu_organizations.json
  def create
    @yfu_organization = YfuOrganization.new(yfu_organization_params)

    if @yfu_organization.save
      render json: @yfu_organization, status: :created, location: @yfu_organization
    else
      render json: @yfu_organization.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /yfu_organizations/1
  # PATCH/PUT /yfu_organizations/1.json
  def update
    @yfu_organization = YfuOrganization.find(params[:id])

    if @yfu_organization.update(yfu_organization_params)
      head :no_content
    else
      render json: @yfu_organization.errors, status: :unprocessable_entity
    end
  end

  # DELETE /yfu_organizations/1
  # DELETE /yfu_organizations/1.json
  def destroy
    @yfu_organization.destroy

    head :no_content
  end

  private

    def set_yfu_organization
      @yfu_organization = YfuOrganization.select(:id,:name).find(params[:id])
    end

    def yfu_organization_params
      params.require(:yfu_organization).permit(:name)
    end
end
