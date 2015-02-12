/**
 * Created by Niels on 12/02/2015.
 */
angular.module('PhotoAPI',['ngResource'])
    .factory('Category',['$resource', function ($resource) {
        return $resource('/api/categories/:id',null,
            {
                'update':{method:'PUT'}
            });
    }])
    .factory('Keyword',['$resource', function ($resource) {
        return $resource('/api/keywords/:id',null,
            {
                'update':{method:'PUT'}
            });
    }])
    .factory('Photo',['$resource', function ($resource) {
        return $resource('/api/photos/:id',null,
            {
                'update':{method:'PUT'}
            });
    }])
    .factory('PhotoKeyword',['$resource', function ($resource) {
        return $resource('/api/photos_keywords/:id',null,
            {
                'update':{method:'PUT'}
            });
    }])
    .factory('PhotoCategory',['$resource', function ($resource) {
        return $resource('/api/photos_categories/:id',null,
            {
                'update':{method:'PUT'}
            });
    }])
    .factory('Roles',['$resource', function ($resource) {
        return $resource('/api/my_roles');
    }]);