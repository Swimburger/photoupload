class ApplicationController < ActionController::API
  include CanCan::ControllerAdditions
  rescue_from CanCan::AccessDenied do |exception|
    render text: 'Unauthorized to access this resource', status: :unauthorized, :alert => exception.message
  end
end
