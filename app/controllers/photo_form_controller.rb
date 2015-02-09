class PhotoFormController < ActionController::Base
  def index
  end

  def upload
    puts params
    render json: nil, status: :ok
  end
  def success

  end
end
