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
    angular.module('PhotoBrowser', ['ngRoute','ngMaterial','wu.masonry','multi-select','PhotoAPI'])
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
        .controller('PhotoDetailsController',['$scope','$routeParams','$location','$q','$mdDialog','Photo','Category','Keyword','PhotoKeyword','PhotoCategory','Country','Organization',
            function($scope,$routeParams,$location,$q,$mdDialog,Photo,Category,Keyword,PhotoKeyword,PhotoCategory,Country,Organization){
                $scope.photo = Photo.get({id:$routeParams.id});
                $scope.photoCopy = {};
                $scope.mode='default';//default|edit|detail
                $scope.countries = Country.query();
                $scope.organizations = Organization.query();
                $scope.keywords= Keyword.query();
                $scope.photoKeywords = PhotoKeyword.query({photo_id:$routeParams.id});
                $scope.categories= Category.query();
                $scope.photoCategories = PhotoCategory.query({photo_id:$routeParams.id});
                $scope.years = years;
                $scope.statuses = statuses;

                $q.all([$scope.photo.$promise,$scope.countries.$promise]).then(initPhotoCountry);
                $q.all([$scope.photo.$promise,$scope.organizations.$promise]).then(initPhotoOrganization);
                $q.all([$scope.keywords.$promise,$scope.photoKeywords.$promise]).then(initPhotoKeywords);
                $q.all([$scope.categories.$promise,$scope.photoCategories.$promise]).then(initPhotoCategories);

                $scope.closeDialog=function(){
                    $mdDialog.hide();
                    $location.path('/photos');
                };
                $scope.edit=function(){
                    $scope.mode='edit';
                    angular.copy($scope.photo,$scope.photoCopy);
                };
                $scope.save=function(){
                    var promises=[];
                    $scope.photo.categories.length=0;
                    angular.forEach($scope.categories,function(category){
                        if(category.checked){
                            $scope.photo.categories.push(category);
                            promises.push(PhotoCategory.save({photo_id:$routeParams.id,category_id:category.id}).$promise);
                        }else{

                        }
                    });
                    angular.forEach($scope.photo.keywords,function(keyword){
                        promises.push(PhotoKeyword.save({photo_id:$routeParams.id,keyword_id:keyword.id}).$promise);
                    });
                    promises.push($scope.photo.$update({id:$scope.photo.id}));

                    $q.all(promises).then(function(){
                        $scope.mode='default';
                        $scope.error=false;
                    }).catch(function(){
                        $scope.error=true;
                    });
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
                }
                function initPhotoOrganization(){
                    angular.forEach($scope.organizations,function(organization,key){
                        if(organization.id==$scope.photo.organization_id){
                            $scope.photo.organization=organization;
                        }
                    });
                }
                function initPhotoKeywords(){
                    $scope.photo.keywords=[];
                    doubleForEach($scope.keywords,$scope.photoKeywords,function(keyword,photoKeyword){
                        if(keyword.id==photoKeyword.keyword_id){
                            $scope.photo.keywords.push(keyword);
                        }
                        photoKeyword.existsInDb
                    });
                }
                function initPhotoCategories(){
                    $scope.photo.categories=[];
                    doubleForEach($scope.categories,$scope.photoCategories,function(category,photoCategory){
                        if(category.id==photoCategory.category_id){
                            category.checked=true;
                            $scope.photo.categories.push(category);
                        }else{
                            category.checked=false;
                        }
                        photoCategory.existsInDb=true;
                    });
                    angular.forEach($scope.photo.categories,function(category){
                        category.checked=true;
                    });
                }
                $scope.joinCategories=function(categories){
                    var string = '';
                    angular.forEach(categories,function(category,index){
                        string += (category.name + (index==(categories.length-1)? '':', '));
                    });
                    return string;
                };
                $scope.joinKeywords=function(keywords){
                    var string = '';
                    angular.forEach(keywords,function(keyword,index){
                        string +=(keyword.word + (index==(keywords.length-1)? '':', '));
                    });
                    return string;
                }
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
    function doubleForEach(collection1,collection2,callback){
        var i1,i2,item1,item2;
        for(i1 = 0;i1<collection1.length;i1++){
            item1=collection1[i1];
            for(i2 = 0;i2<collection2.length;i2++){
                item2=collection2[i2];
                callback(item1,item2,i1,i2);
            }
        }
    }
})();
