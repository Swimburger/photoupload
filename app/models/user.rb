class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :confirmable#, :omniauthable
  include DeviseTokenAuth::Concerns::User
  include RoleModel

  # optionally set the integer attribute to store the roles in,
  # :roles_mask is the default
  roles_attribute :roles_mask

  # declare the valid roles -- do not change the order if you add more
  # roles later, always append them at the end!
  roles :admin, :reader

  before_save -> do
    #self.uid = SecureRandom.uuid
    self.provider = 'email' #force email only
    skip_confirmation!
  end
end
