/**
 * Created by Niels on 2/02/2015.
 */
'use strict';

angular.module('fakeLunchHubApp',
    [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ng-token-auth'
    ])
    .config(function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl: 'assets/templates/home.html',
                controller:'MainController'
            })
            .when('/about',{
                templateUrl: 'assets/templates/about.html',
                controller: 'AboutController'
            })
            .when('/groups',{
                templateUrl: 'assets/templates/groups.html',
                controller: 'GroupsController',
                resolve: { auth:['$auth', function($auth) {
                    return $auth.validateUser();
                }] }
                })
            .when('/sign_in',{
                templateUrl: 'assets/templates/login.html',
                controller: 'UserSessionsController'
            })
            .otherwise({redirectTo:'/'});
    })
    .controller('MainController',function(){
        console.log('test');
    })
    .controller('GroupsController',['$scope','Group',function($scope,Group){
        $scope.groups = Group.query();
    }]).controller('UserSessionsController', ['$scope','$auth', function ($scope,$auth) {
        $scope.$on('auth:login-error', function(ev, reason) {
            $scope.error = reason.errors[0];
        });
    }])
    .factory('Group',['$resource',function($resource){
        return $resource('/api/groups/:id.json',null,{
            'update':{method:'PUT'}
        });
    }])
    .run(['$rootScope','$location', function ($rootScope, $location) {
        $rootScope.$on('auth:login-success', function () {
            $location.path('/');
        });
    }]);