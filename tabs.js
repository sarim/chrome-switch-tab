function renderTabs(tabs) {
    angular.element(document.getElementById("tab-ctrl")).scope().$apply(function ($scope) {
        $scope.tabs = tabs;
    });    
}

function TabCtrl($scope) {
    $scope.tabs = [];
    
    $scope.selectTab = function(tabId) {
        chrome.tabs.update(tabId, {
            'active': true,
            'highlighted': true
        });
        closeMe();
    }
}

function closeMe() {
    window.close();
}

window.addEventListener("blur", closeMe);