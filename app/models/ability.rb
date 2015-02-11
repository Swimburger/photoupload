class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here.
    user ||= User.new # guest user (not logged in)
    # a signed-in user can do everything
    if user.has_role? :admin
      # an admin can do everything
      can :manage, :all
    elsif user.has_role? :reader
      # an editor can do everything to documents and reports
      can :read, :all
    else
      can :read, [Category,Country,Keyword,YfuOrganization]
    end
  end
end
