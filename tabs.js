function renderTabs(tabs) {
    angular.element(document.getElementById("tab-ctrl")).scope().$apply(function ($scope) {
        $scope.setTabs(tabs);
    });
}

function closeMe() {
    window.close();
}

window.addEventListener("blur", closeMe);

(function(){
    var app = angular.module('switchTab', ['angularMoment']);
    app.controller('TabCtrl', ['$scope', '$filter', function($scope, $filter) {
        $scope.tabs = [];
        
        $scope.searchClear = function() {
            $scope.search = '';
        }
        
        $scope.$watch('search', function() {
            $scope.showTabs = $filter('filter')($scope.tabs, {title: $scope.search}, false);
            $scope.selectedTab = $scope.showTabs[0];
        });
    
        $scope.isSelected = function(tab) {
            return $scope.selectedTab == tab;
        }
        
        $scope.setTabs = function(tabs) {
            $scope.tabs = $filter('orderBy')(tabs, 'lastActive', true);
            $scope.showTabs = $scope.tabs;
            $scope.selectedTab = $scope.showTabs[0];
        }
        
        $scope.onKeydown = function($event) {
            if ($event.keyCode == 38) {
                var index = $scope.showTabs.indexOf($scope.selectedTab) - 1;
                if (index < 0) index = $scope.showTabs.length - 1;
                
                $scope.selectedTab = $scope.showTabs[index];
                $event.preventDefault();
            } else if ($event.keyCode == 40) {
                var index = $scope.showTabs.indexOf($scope.selectedTab) + 1;
                if (index == $scope.showTabs.length) index = 0;
                
                $scope.selectedTab = $scope.showTabs[index];
                $event.preventDefault();
            } else if ($event.keyCode == 13) {
                $event.preventDefault();
                $scope.selectTab($scope.selectedTab);
            }
        }
    
        $scope.selectTab = function(tab) {
            chrome.tabs.update(tab.id, {
                'active': true,
                'highlighted': true
            });
            chrome.windows.update(tab.windowId, {
                focused: true
            });
            
            closeMe();
        }        
    }]);
    
    
    app.config( [
        '$compileProvider',
        function( $compileProvider ) {
            var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
        }
    ]);
    
})();
