var pushTabsToPopup = function(tabs) {
var views = chrome.extension.getViews({type: 'tab' /* 'windowId' : window.id*/ });
    views[0].renderTabs(tabs);
}

var createTabList = function(tabObjs) {
    var tabs = [];
    tabObjs.forEach(function(t){
        tabs.push({
            id: t.id,
            title: t.title,
            favIconUrl: t.favIconUrl,
        })
    });
    pushTabsToPopup(tabs);
}

var getAllTabs = function(sendResponse) {
    chrome.tabs.query({
        currentWindow: false
    }, createTabList);    
}

var openTabListPopup = function() {
    chrome.windows.create({
        'url': 'tabs.html',
        'type': 'popup',
        'height': 500,
        'width': 400,
        'left' : (screen.width / 2 - 200),
        'top': 100
    }, function(window) {
        getAllTabs();
    });
}

chrome.commands.onCommand.addListener(function(command) {
    if (command == "switch-tab") {
        openTabListPopup();
    }
});