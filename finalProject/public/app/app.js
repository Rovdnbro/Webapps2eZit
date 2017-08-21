angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices'/*, 'postServices'*/])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});