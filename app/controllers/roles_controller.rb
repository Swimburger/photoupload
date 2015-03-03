class RolesController < ApplicationController
  def get_my_roles
    if(!user_signed_in?)
      return render text: 'Unauthorized to access this resource', status: :unauthorized
    end
    render json: current_user.roles
  end
end
