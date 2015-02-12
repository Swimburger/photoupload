/**
 * Created by Niels on 12/02/2015.
 */
angular.module('PhotoBrowser', ['ngMaterial','wu.masonry','PhotoAPI'])
    .controller('RootController', ['$scope','Category', 'Keyword', 'Photo', 'PhotoKeyword', 'PhotoCategory', 'Roles',
        function($scope, Category, Keyword, Photo, PhotoKeyword, PhotoCategory, Roles){
            $scope.categories = Category.query();
            $scope.keywords = Keyword.query();
            $scope.photos = Photo.query();
            $scope.photoKeywords = PhotoKeyword.query();
            $scope.photoCategories = PhotoCategory.query();
            $scope.roles = Roles.query();
            var tabs = [
                { title: 'Photos', template: "/assets/templates/photos.html"},
                { title: 'Categories', template: "/assets/templates/categories.html"},
                { title: 'Keywords', template: "/assets/templates/keywords.html"}
            ];
            $scope.tabs = tabs;
        }])
    .controller('PhotosController',['$scope','Photo','Category','Keyword','PhotoKeyword','PhotoCategory',
        function($scope,Photo,Category,Keyword,PhotoKeyword,PhotoCategory){
            $scope.photos=Photo.query();
        }
    ]);