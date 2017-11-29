/**
 * router
 */


var sysApp = angular.module("sysApp", ["ui.router", "sysController", "sysService","sysFilter"]);

sysApp.factory('myDetectorSet', function($location, $q,$cookieStore) {
    return {
        response: function(response) {
            if(response.data.stateCode==312) {
                $cookieStore.remove("userName");
                errorMsg.make({msg: "请登录,2秒后自动跳转到登录页!", url: ""});
                return response;
            }else{
                return response;
            }
        },
        request: function(conf){
            return conf;
        },
        requestError: function(err){
            return $q.reject(err);
        },
        responseError: function(err){
            //console.log(err);
            if(err.status === 0) {
                $cookieStore.remove("userName");
                errorMsg.make({msg: "与服务端通信失败!", url: "",second:3});
            } else if(err.status ==404 ) {
                errorMsg.make({msg: "接口地址错误!"});
            } else {
                errorMsg.make({msg: "请求失败!"});
            }
            return $q.reject(err);
        }
    };
});

sysApp.config(['$httpProvider', function($httpProvider) {

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('myDetectorSet');
    $httpProvider.defaults.useXDomain = true;

}]).config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("", "/login");
    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "/templates/login.html",
            controller: "LoginController"
        })
        .state("main", {
            url: "/main",
            templateUrl: "/templates/main.html",
            controller:"MainController"
        })

        //首页统计
        .state("main.default", {
            url: "/default",
            templateUrl: "/templates/center/count/count.html",
            controller:""
        })

        //快捷收款
        .state("main.fast-pay", {
            url:"/fast-pay",
            templateUrl:"/templates/center/fastpay/fast-pay-list.html",
            controller:"fastPayListController"
        })

        //快捷收款-交易列表
        .state("main.deal-list", {
            url:"/deal-list",
            templateUrl:"/templates/center/fastpay/deal-list.html",
            controller:"fastPayDealListController"
        })



});