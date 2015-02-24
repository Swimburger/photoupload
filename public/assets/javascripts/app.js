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
    var msgs={
        keywordCreated:'keywordCreated',
        categoryCreated:'categoryCreated',
        photoCreated:'photoCreated'
    };
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
        .controller('RootController', ['$scope','$location','$mdDialog', 'Role',
            function($scope,$location,$mdDialog, Role){
                Role.query().$promise.then(function(roles){
                    $scope.isAdmin = roles.indexOf('admin')>-1;
                    $scope.$root.isAdmin=$scope.isAdmin;
                });
                $scope.tabs = [
                    { title: 'Photos', template: "/assets/templates/photos.html"},
                    { title: 'Categories', template: "/assets/templates/categories.html"},
                    { title: 'Keywords', template: "/assets/templates/keywords.html"}
                ];
                $scope.rootCtrl.selectedIndex=0;
                $scope.showSearch=$location.search().showSearch?true:false;

                $scope.create=function(){
                    switch($scope.rootCtrl.selectedIndex){
                        case 1:
                            $mdDialog.show({
                                templateUrl:'/assets/templates/category_create.html',
                                controller:'CreateCategoryController',
                                controllerAs:'createCategoryCtrl'
                            });
                            break;
                        case 2:
                            $mdDialog.show({
                                templateUrl:'/assets/templates/keyword_create.html',
                                controller:'CreateKeywordController',
                                controllerAs:'createKeywordsCtrl'
                            });
                            break;
                    }
                }
            }])
        .controller('PhotosController',['$scope','$q','$route','$routeParams','$location','Photo','Country','Organization','Category','Keyword','PhotoKeyword','PhotoCategory',
            function($scope,$q,$route,$routeParams,$location,Photo,Country,Organization,Category,Keyword,PhotoKeyword,PhotoCategory){
                var countries= Country.query(),
                    organizations = Organization.query(),
                    categories = Category.query(),
                    keywords = Keyword.query(),
                    photoKeywords = PhotoKeyword.query(),
                    photoCategories = PhotoCategory.query();
                $scope.photos=Photo.query();
                $scope.itemsPerPage = 10;
                $scope.currentPage = $routeParams.page?$routeParams.page:0;
                $scope.search = $routeParams.search? $routeParams.search: '';
                $scope.finalQuery='';
                $scope.finalOrder='';
                $scope.ascending=$routeParams.ascending? $routeParams.ascending:true;
                $scope.finalAscending=$scope.ascending;
                $scope.minRes=$routeParams.minRes? $routeParams.minRes:0;
                $scope.finalMinRes=$scope.minRes;
                $scope.properties=['all','caption','country','organization','year','people','keywords','categories','uploaded by'];
                $scope.orderProperties=['caption','country','organization','year','people','uploaded by','height','width'];
                if($routeParams.propertyToOrder){
                    $scope.propertyToOrder=$routeParams.propertyToOrder;
                }
                $scope.propertyToSearch=$routeParams.propertyToSearch? $routeParams.propertyToSearch:$scope.properties[0];
                $scope.statuses = statuses;
                $scope.selectedStatus=$routeParams.status? $routeParams.status:'';
                $scope.finalStatus=$scope.selectedStatus;
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

                $scope.searchPhotos= function (search,propertyToSearch,propertyToOrder,ascending,minRes,selectedStatus,page) {
                    $scope.finalQuery=getFilter(search,propertyToSearch);
                    $scope.finalOrder=propertyToOrder;
                    $scope.finalAscending=ascending;
                    $scope.finalMinRes=minRes;
                    $scope.finalStatus=selectedStatus;
                    $scope.currentPage=page?page:0;
                    setRouteParams();
                };
                $scope.searchPhotos($scope.search,$scope.propertyToSearch,$scope.propertyToOrder,$scope.ascending,$scope.minRes,$scope.selectedStatus,$scope.currentPage);

                $scope.greaterThen=function(prop, val) {
                    return function (item) {
                        return item[prop] > val;
                    }
                };

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
                        $route.updateParams({page:$scope.currentPage});
                    }
                };

                $scope.prevPageDisabled = function() {
                    return $scope.currentPage === 0 ? "disabled" : "";
                };

                $scope.pageCount = function(photos) {
                    return Math.ceil(photos.length/$scope.itemsPerPage)-1;
                };

                $scope.nextPage = function(photos) {
                    if ($scope.currentPage < $scope.pageCount(photos)) {
                        $scope.currentPage++;
                        $route.updateParams({page:$scope.currentPage});
                    }
                };

                $scope.nextPageDisabled = function(photos) {
                    return $scope.currentPage === $scope.pageCount(photos) ? "disabled" : "";
                };

                $scope.setPage = function(n) {
                    $scope.currentPage = n;
                    $route.updateParams({page:n});
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
                function setRouteParams(){
                    $route.updateParams({
                        search:$scope.search,
                        propertyToSearch:$scope.propertyToSearch,
                        propertyToOrder:$scope.propertyToOrder,
                        order:$scope.finalOrder,
                        ascending:$scope.finalAscending,
                        minRes:$scope.finalMinRes,
                        status:$scope.finalStatus,
                        page:$scope.currentPage,
                        showSearch:$scope.showSearch?'true':'false'
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
                $scope.isAdmin=$scope.$root.isAdmin;
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
            }])
        .controller('CategoriesController',['$scope','$mdDialog','Category',function($scope,$mdDialog,Category){
            $scope.categories = Category.query();
            $scope.edit=function(category){
                $mdDialog.show({
                    templateUrl:'/assets/templates/category_details.html',
                    locals:{
                        category:category
                    },
                    controller:'CategoryDetailsController',
                    controllerAs:'CategoryDetailsCtrl'
                });
            };
            $scope.$on(msgs.categoryCreated,function(event,category){
                $scope.categories.push(category);
            });

        }])
        .controller('CategoryDetailsController',['$scope','$mdDialog','category',
            function($scope,$mdDialog,category){
                $scope.category=angular.copy(category);
                $scope.save=function(){
                    $scope.category.$update({id:$scope.category.id}).then(function(){
                        category.name=$scope.category.name;
                        $mdDialog.hide();
                    }).catch(function () {
                        $scope.error=true;
                    });
                };
                $scope.cancel=function(){
                    $mdDialog.hide();
                }
            }])
        .controller('CreateCategoryController',['$scope','$rootScope','$mdDialog','Category',
            function($scope,$rootScope,$mdDialog,Category){
                $scope.category = new Category({
                    name:''
                });
                $scope.save=function(){
                    if($scope.category.name.length>1){
                        $scope.category.$save().then(function(){
                            $rootScope.$broadcast(msgs.categoryCreated,$scope.category);
                            $mdDialog.hide();
                        }).catch(function(){
                            $scope.error=true;
                        });
                    }
                };
                $scope.cancel=function(){
                    $mdDialog.hide();
                };
            }])
        .controller('KeywordsController',['$scope','$mdDialog','Keyword',function($scope,$mdDialog,Keyword){
            $scope.keywords = Keyword.query();
            $scope.edit=function(keyword){
                $mdDialog.show({
                    templateUrl:'/assets/templates/keyword_details.html',
                    locals:{
                        keyword:keyword
                    },
                    controller:'KeywordDetailsController',
                    controllerAs:'keywordDetailsCtrl'
                });
            };
            $scope.$on(msgs.keywordCreated,function(event,keyword){
               $scope.keywords.push(keyword);
            });
        }])
        .controller('KeywordDetailsController',['$scope','$mdDialog','keyword',
            function($scope,$mdDialog,keyword){
                $scope.keyword=angular.copy(keyword);
                $scope.save=function(){
                    $scope.keyword.$update({id:$scope.keyword.id}).then(function(){
                        keyword.word=$scope.keyword.word;
                        keyword.is_predefined=$scope.keyword.is_predefined;
                        $mdDialog.hide();
                    }).catch(function () {
                        $scope.error=true;
                    });
                };
                $scope.cancel=function(){
                    $mdDialog.hide();
                };
            }])
        .controller('CreateKeywordController',['$scope','$rootScope','$mdDialog','Keyword',
            function($scope,$rootScope,$mdDialog,Keyword){
                $scope.keyword = new Keyword({
                    word:'',
                    is_predefined:true
                });
                $scope.save=function(){
                    if($scope.keyword.word.length>1){
                        $scope.keyword.$save().then(function(){
                            $rootScope.$broadcast(msgs.keywordCreated,$scope.keyword);
                            $mdDialog.hide();
                        }).catch(function(){
                            $scope.error=true;
                        });
                    }
                };
                $scope.cancel=function(){
                    $mdDialog.hide();
                };
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
