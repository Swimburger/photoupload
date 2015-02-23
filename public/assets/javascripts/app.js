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
    angular.module('PhotoBrowser', ['ngRoute','ngMaterial','ngAnimate','ngFx','PhotoAPI'])
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
        .controller('PhotosController',['$scope','$q','$location','Photo','Country','Organization','Category','Keyword','PhotoKeyword','PhotoCategory',
            function($scope,$q,$location,Photo,Country,Organization,Category,Keyword,PhotoKeyword,PhotoCategory){
                var countries= Country.query(),
                    organizations = Organization.query(),
                    categories = Category.query(),
                    keywords = Keyword.query(),
                    photoKeywords = PhotoKeyword.query(),
                    photoCategories = PhotoCategory.query();
                $scope.photos=Photo.query();
                $scope.itemsPerPage = 10;
                $scope.currentPage = 0;
                $scope.search = '';
                $scope.finalQuery='';
                $scope.finalOrder='';
                $scope.ascending=true;
                $scope.finalAscending=true;
                $scope.minRes=0;
                $scope.finalMinRes=0;
                $scope.properties=['all','caption','country','organization','year','people','keywords','categories','uploaded by'];
                $scope.orderProperties=['caption','country','organization','year','people','uploaded by','height','width'];
                $scope.propertyToSearch=$scope.properties[0];
                function getFilter(query,property) {
                    switch (property){
                        case 'caption':
                            return {caption: query};
                        case 'country':
                            return {country: query};
                        case 'organization':
                            return {organization:query};
                        case 'year':
                            return {year:query};
                        case 'people':
                            return {people_in_photo:query};
                        case 'keywords':
                            return {keywords:query};
                        case 'categories':
                            return {categories:query};
                        case 'uploaded by':
                            return {uploaded_by_name:query};
                        default:
                            return query;
                    }
                }

                $scope.searchPhotos= function (search,propertyToSearch,propertyToOrder,ascending) {
                    $scope.finalQuery=getFilter(search,propertyToSearch);
                    $scope.finalOrder=propertyToOrder;
                    $scope.finalAscending=ascending;
                    $scope.finalMinRes=$scope.minRes;
                    $scope.currentPage=0;
                };

                $scope.greaterThen=function(prop, val) {
                    return function (item) {
                        return item[prop] > val;
                    }
                }

                $q.all([$scope.photos.$promise,countries.$promise]).then(initPhotosCountries);
                $q.all([$scope.photos.$promise,organizations.$promise]).then(initPhotosOrganizations);
                $q.all([$scope.photos.$promise,photoKeywords.$promise,keywords.$promise]).then(initPhotosKeywords);
                $q.all([$scope.photos.$promise,photoCategories.$promise,categories.$promise]).then(initPhotosCategories);


                $scope.showDetails=function(id){
                    $location.path('/photos/'+id);
                };

                $scope.prevPage = function() {
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                    }
                };

                $scope.prevPageDisabled = function() {
                    return $scope.currentPage === 0 ? "disabled" : "";
                };

                $scope.pageCount = function(photos) {
                    return Math.ceil(photos.length/$scope.itemsPerPage)-1;
                }

                $scope.nextPage = function(photos) {
                    if ($scope.currentPage < $scope.pageCount(photos)) {
                        $scope.currentPage++;
                    }
                };

                $scope.nextPageDisabled = function(photos) {
                    return $scope.currentPage === $scope.pageCount(photos) ? "disabled" : "";
                };

                $scope.setPage = function(n) {
                    $scope.currentPage = n;
                };

                function initPhotosCountries() {
                    doubleForEach($scope.photos,countries,function(photo,country){
                        if(photo.country_id==country.id){
                            photo.country=country.name;
                        }
                    });
                }
                function initPhotosOrganizations() {
                    doubleForEach($scope.photos,organizations,function(photo,organization){
                        if(photo.yfu_organization_id==organization.id){
                            photo.organization=organization.name;
                        }
                    });
                }
                function initPhotosKeywords() {
                    tripleForEach($scope.photos,photoKeywords,keywords,function(photo,photoKeyword,keyword){
                        if(!photo.keywords){
                            photo.keywords = '';
                        }
                        if(photo.id==photoKeyword.photo_id&&photoKeyword.keyword_id==keyword.id){
                            photo.keywords+=keyword.word + ' ';
                        }
                    });
                }
                function initPhotosCategories() {
                    tripleForEach($scope.photos,photoCategories,categories,function(photo,photoCategory,category){
                        if(!photo.categories){
                            photo.categories = '';
                        }
                        if(photo.id==photoCategory.photo_id&&photoCategory.category_id==category.id){
                            photo.categories+=category.name + ' ';
                        }
                    });
                }
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
                    $scope.photo.categories.length=0;
                    angular.forEach($scope.categories,function(category){
                        if(category.checked){
                            $scope.photo.categories.push(category);
                        }else{

                        }
                    });
                    angular.forEach($scope.photo.keywords,function(keyword){

                    });

                    $scope.photo.country_id=$scope.photo.country.id;

                    $scope.photo.$update({id:$scope.photo.id}).then(function(){
                        $scope.mode='default';
                        $scope.error=false;
                    }).catch(function () {
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
                        if(organization.id==$scope.photo.yfu_organization_id){
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
    function tripleForEach(collection1,collection2,collection3,callback){
        var i1,i2,i3,item1,item2,item3;
        for(i1 = 0;i1<collection1.length;i1++){
            item1=collection1[i1];
            for(i2 = 0;i2<collection2.length;i2++){
                item2=collection2[i2];
                for(i3 = 0;i3<collection3.length;i3++){
                    item3=collection3[i3];
                    callback(item1,item2,item3,i1,i2,i3);
                }
            }
        }
    }
})();
