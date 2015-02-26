# Photo Uploader
The Photo Upload is an application to give a user friendly and consistent way to upload pictures for students, host families and employees to YFU. The uploaded photo's should be easily browsable for Admins, Designers, etc at YFU.

The application exists out of two parts
* Photo Upload Form: A user friendly form to upload multiple pictures at once and provide details about them
* Photo Browser: The authenticated part of the application to browse the uploaded pictures

## Set Up
Before you get started you need to set up some things.

1. Update config/database.yml to your database params, [example](http://stackoverflow.com/a/7306399/2919731).
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

## Photo Upload Form
The upload form is created using the following frameworks/libraries
* [JQuery](http://jquery.com/)
* [Bootstrap](http://getbootstrap.com/)
* [Select2](https://select2.github.io/) for the select boxes with search and tag support
* [jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload) for the progress ajax file upload

The form has its own controller (app/controllers/photo_form_controller) but also uses the api to get the countries, organizations, keywords and categories.
The view can be found at app/views/photo_form/index.html.erb.
The javascript can be found at public/assets/javascripts/photo_form.js | JQApi.js

You can access to the form at the '/' root route.

## Photo Browser
The Photo Browser has been created with [AngularJS](https://angularjs.org/) and [Material Angular](https://material.angularjs.org).   
AngularJS is an MVC/MVVM/MVW javascript framework for creating high performance web apps.   
Material Angular is a GUI framework that provides GUI components implemented with the [Material Design](http://www.google.com/design/) language.  

The browser has its own controller (app/controlles/admin) but uses all the api controllers.  
The view can be found at app/views/admin/index.html.erb and the templates at public/assets/templates/*.   
The javascript can be found at public/assets/javacripts/app.js | PhotoAPI.js.   
The css can be found at public/assets/stylesheets/app.css.   

You can access the browser at the '/admin' route but you will need to be logged in.

## JSON API
These apps both use a REST JSON API built with (rails-api)[https://github.com/rails-api/rails-api).
You can find out how to consume the api at the [API Wiki page](wiki/API).
You can read more about the models and their relations at the [Models Wiki page](wiki/models).
