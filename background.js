var pushTabsToPopup = function(tabs) {
var views = chrome.extension.getViews({type: 'tab' /* 'windowId' : window.id*/ });
    views[0].renderTabs(tabs);
}

var createTabList = function(tabObjs) {
    var tabs = [];
    
    var windowCounts = {};
    var windowCount = 0;
    
    var getWindowCount = function(windowId) {
        if (windowCounts[windowId] === undefined) {
            windowCounts[windowId] = ++windowCount;
        }
        return windowCounts[windowId];        
    }
    
    tabObjs.forEach(function(t) {
        if (!t.active)
        tabs.push({
            id: t.id,
            title: t.title,
            url: t.url,
            favIconUrl: t.favIconUrl,
            lastActive: tabHistory.get(t.id),
            windowId: t.windowId,
            windowCount: getWindowCount(t.windowId)
        });
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

chrome.tabs.onActivated.addListener(function(activeInfo) {
    var tabSelected = tabHistory.getSelected();
    if (tabSelected) {
        tabHistory.set(tabSelected, new Date());
    }
    tabHistory.setSelected(activeInfo.tabId);
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == "switch-tab") {
        openTabListPopup();
    }
});

var tabHistory = {
    set: function(tid, time) {
        localStorage[tid] = JSON.stringify(time);
    },
    get: function(tid) {
        var time = localStorage[tid];
        if (time) {
            return new Date(JSON.parse(time));
        }
    },
    setSelected: function(tid) {
        localStorage.tabSelected = tid;
    },
    getSelected: function() {
        return localStorage.tabSelected;
    },
};
