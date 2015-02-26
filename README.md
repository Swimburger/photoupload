# Photo Uploader
The Photo Upload is an application to give a user friendly and consistent way to upload pictures for students, host families and employees to YFU. The uploaded photo's should be easily browsable for Admins, Designers, etc at YFU.

The application exists out of two parts
* Photo Upload Form: A user friendly form to upload multiple pictures at once and provide details about them
* Photo Browser: The authenticated part of the application to browse the uploaded pictures

## Set Up
Before you get started you need to set up some things.

1. Update config/database.yml to your database params, [example](http://stackoverflow.com/questions/7304576/how-do-i-set-up-the-database-yml-file-in-rails)
2. Create database, migrate, seed data, (if you have photos from the old uploader you can import them, see wiki import)   
  ```
  >rake db:create   
  ```   
  ```
  >rake db:migrate   
  ```   
  ```
  >rake db:seed  
  ```   
  ```
  >[rake import:old_photos]   
  ```   
3. Bower install components in public/assets   
  ```
  public/assets>bower install
  ```  
4. Run rails   
  ```
  >rails s  
  ```  
