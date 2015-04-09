namespace :user do
  desc 'Add or remove users'
  task add: [:environment] do |t, args|
    mail = ENV['mail'] or raise 'No mail specified, use mail='
    pwd = ENV['pwd'] or raise 'No password specified, use pwd='
    role = ENV['role'] or raise 'No mail specified, use role=admin or =reader'
    user = User.new
    user.email=mail
    user.password=pwd
    user.password_confirmation = pwd
    if role=='admin'
      user.roles << :admin
    elsif role=='reader'
      user.roles << :reader
    end
    user.save!
  end

  task remove: [:environment] do |t, args|
    mail = ENV['mail'] or raise 'No mail specified, use mail='
    User.find_by_email(mail).destroy
  end
end
