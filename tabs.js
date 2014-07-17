function renderTabs(tabs) {
    angular.element(document.getElementById("tab-ctrl")).scope().$apply(function ($scope) {
        $scope.tabs = tabs;
    });
}

function closeMe() {
    window.close();
}

window.addEventListener("blur", closeMe);

(function(){
    var app = angular.module('switchTab', ['angularMoment']);
    app.controller('TabCtrl', ['$scope', function($scope) {
        $scope.tabs = [];
    
        $scope.selectTab = function(tabId) {
            chrome.tabs.update(tabId, {
                'active': true,
                'highlighted': true
            });
            closeMe();
        }        
    }]);    
})();
