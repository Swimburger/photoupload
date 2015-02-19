/**
 * Created by Niels on 12/02/2015.
 */
(function(){
    var years = [],
        currentYear = new Date().getFullYear(),
        year;
    for(year=1951;year<=currentYear;year++){
        years.push(year);
    }
    var statuses = ['unreviewed','approved','rejected','no_usage'];
    angular.module('PhotoBrowser', ['ngRoute','ngAnimate','ngMaterial','wu.masonry','multi-select','PhotoAPI'])
        .config(['$routeProvider',function($routeProvider){
            $routeProvider
                .when("/photos", {

                })
                .when("/photos/:id", {
                    controller: 'PhotoPopupController',
                    template:' '
                })
                .when('/keywords',{

                })
                .when('/categories',{

                })
                .otherwise('/photos');
        }])
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
        .controller('PhotosController',['$scope','$location','Photo','Category','Keyword','PhotoKeyword','PhotoCategory',
            function($scope,$location,Photo,Category,Keyword,PhotoKeyword,PhotoCategory){
                $scope.photos=Photo.query();
                $scope.itemsPerPage = 10;
                $scope.currentPage = 0;

                $scope.showDetails=function(id){
                    $location.path('/photos/'+id);
                };


                $scope.range = function() {
                    var rangeSize = 5;
                    var ret = [];
                    var start;

                    start = $scope.currentPage;
                    if ( start > $scope.pageCount()-rangeSize ) {
                        start = $scope.pageCount()-rangeSize+1;
                    }

                    for (var i=start; i<start+rangeSize; i++) {
                        ret.push(i);
                    }
                    return ret;
                };

                $scope.prevPage = function() {
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                    }
                };

                $scope.prevPageDisabled = function() {
                    return $scope.currentPage === 0 ? "disabled" : "";
                };

                $scope.pageCount = function() {
                    return Math.ceil($scope.photos.length/$scope.itemsPerPage)-1;
                };

                $scope.nextPage = function() {
                    if ($scope.currentPage < $scope.pageCount()) {
                        $scope.currentPage++;
                    }
                };

                $scope.nextPageDisabled = function() {
                    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
                };

                $scope.setPage = function(n) {
                    $scope.currentPage = n;
                };
            }
        ])
        .controller('PhotoPopupController',['$mdDialog',function($mdDialog){
            $mdDialog.show({
                templateUrl:'/assets/templates/photo_details.html',
                controller:'PhotoDetailsController',
                controllerAs:'photoDetailsCtrl',
                clickOutsideToClose:false,
                escapeToClose:false
            });
        }])
        .controller('PhotoDetailsController',['$scope','$routeParams','$location','$mdDialog','Photo','Category','Keyword','PhotoKeyword','PhotoCategory','Country','Organization',
            function($scope,$routeParams,$location,$mdDialog,Photo,Category,Keyword,PhotoKeyword,PhotoCategory,Country,Organization){
                $scope.photo = Photo.get({id:$routeParams.id});
                $scope.photoCopy = {};
                $scope.mode='default';//default|edit|detail
                $scope.countries = Country.query();
                $scope.organizations = Organization.query();
                $scope.keywords=Keyword.query();
                $scope.categories=Category.query();
                $scope.years = years;
                $scope.statuses = statuses;

                $scope.photo.$promise.then(initPhotoCountry);
                $scope.countries.$promise.then(initPhotoCountry);

                $scope.closeDialog=function(){
                    $mdDialog.hide();
                    $location.path('/photos');
                };
                $scope.edit=function(){
                    $scope.mode='edit';
                    angular.copy($scope.photo,$scope.photoCopy);
                };
                $scope.save=function(){
                    $scope.photo.$update({id:$scope.photo.id});
                    //TODO: save cats and keywords
                    $scope.mode='default';
                };
                $scope.cancel=function(){
                    $scope.mode='default';
                    $scope.photo = $scope.photoCopy;
                };
                $scope.details=function(){
                    $scope.mode=$scope.mode=='details'?'default':'details';
                };
                function initPhotoCountry() {
                    angular.forEach($scope.countries,function(country,key){
                        if(country.id==$scope.photo.country_id){
                            $scope.photo.country=country;
                        }
                    });
                };
            }]
    )
        .controller('CategoriesController',['$scope','Category',function($scope,Category){
            $scope.categories = Category.query();
        }])
        .controller('KeywordsController',['$scope','Keyword',function($scope,Keyword){
            $scope.keywords = Keyword.query();
        }])
        .filter('offset', function() {
            return function (input, start) {
                start = parseInt(start, 10);
                return input.slice(start);
            }
        })
        .filter('range', function() {
            return function(input, total) {
                total = parseInt(total);
                for (var i=0; i<total; i++)
                    input.push(i);
                return input;
            };
        })
        .directive('backImg', function(){
            return function(scope, element, attrs){
                attrs.$observe('backImg', function(value) {
                    element.css({
                        'background-image': 'url(' + value +')',
                        'background-size' : 'cover'
                    });
                });
            };
        });
})();
