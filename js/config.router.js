angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG ) {
         $urlRouterProvider
              .otherwise('/main');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '',
                  templateUrl: 'views/layout.html'
              })
              .state('app.main', {
                  url: '/main',
                  templateUrl: 'views/main.html',
                  controller: 'mainController'

              })
              .state('app.product', {
                  abstract:true ,
                  url: '/product',
                  template: '<ui-view></ui-view>',
              })
              .state('app.product.dashboard', {
                  url: '/dashboard',
                  templateUrl: 'views/product_dashboard.html'
              })

               .state('app.product.api', {
                  url: '/api',
                  templateUrl: 'views/product_api.html'
              })
               .state('app.product.ui', {
                  url: '/ui',
                  templateUrl: 'views/product_ui.html'
              })
               .state('app.product.prebuilt', {
                  url: '/prebuilt',
                  templateUrl: 'views/product_prebuilt.html'
              })


              .state('app.pricing', {
                  url: '/pricing',
                  templateUrl: 'views/pricing.html'
              })
              .state('app.about', {
                  url: '/about',
                  templateUrl: 'views/about.html'
              })
              .state('app.contact', {
                  url: '/contact',
                  templateUrl: 'views/contact.html'
              })

              .state('app.documents', {
                  url: '/documents',
                  reloadOnSearch: false,
                  resolve: {
                        markdown: function ($http, $location) {
                            var page = sourceAddress + "/buremba/rakam/master/README.md";
                            return $http.get(page, {cache: true}).then(function (e) {
                                return e.data
                            }, function () {
                                $location.path('/404');
                            });
                        },
                        sidebar: function ($http) {
                            return $http.get(sourceAddress + "/buremba/rakam-wiki/master/_Sidebar.md", {cache: true}).then(function (e) {
                                return e.data
                            });
                        },
                        parent: function () {
                            return "buremba/rakam-wiki";
                        }
                  },
                  templateUrl: 'views/documents.html',
                  controller: 'docsController',

              })
              .state('app.document', {
                  url: '/document/:name/:repo/*page',
                  templateUrl: 'views/documents.html',
                  controller: 'docsController',
                  reloadOnSearch: false,
                  resolve: {
                    markdown: function ($http, $stateParams,$state, $location) {
                        
                        var page = sourceAddress + "/" + ($stateParams.name + "/" + ($stateParams.repo || 'rakam-wiki')) +
                            "/" + $stateParams.page + ".md";
                        return $http.get(page, {cache: true}).then(function (e) {
                            return e.data
                        }, function () {
                            return "Document not found :(";
                        });
                    },
                    sidebar: function ($http) {
                        return $http.get(sourceAddress + "/buremba/rakam-wiki/master/_Sidebar.md", {cache: true}).then(function (e) {
                            return e.data
                        });
                    },
                    parent: function ($stateParams) {
                        return $stateParams.name +  "/" + ($stateParams.repo || 'rakam-wiki');
                    }
                }
                
              })

              .state('app.integration', {
                  url: '/integration',
                  templateUrl: 'views/integrate.html',
                  controller: 'integrateController',
                  resolve: {
                        markdown: function ($http) {
                            return ""
                        },
                  }

              })

              .state('app.integrate', {
                  url: '/integrate/:name/:repo/*page',
                  templateUrl: 'views/integrate.html',
                  controller: 'integrateController',
                  resolve: {
                    markdown: function ($http, $stateParams,$state, $location) {
                        var page = sourceAddress + "/" + ($stateParams.name + "/" + ($stateParams.repo || 'rakam-wiki')) +
                            "/" + $stateParams.page + ".md";
                        return $http.get(page, {cache: true}).then(function (e) {
                            return e.data
                        }, function () {
                            return "Document not found :(";
                        });
                    }
                   }

              })
              

      

          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    console.log(deferred);
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });

                        return $ocLazyLoad.inject(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }


      }
    ]
  );