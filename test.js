var curUrl;
var reqUrl;

function getUrl() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        curUrl= tabs[0].url;
        
        if (!curUrl.search('http://')) {    // http: true, https: false
            reqUrl= curUrl.replace("http://", "https://");
            
            // jquery: cross-domain http request
            $.ajax({
                url: reqUrl,
                type: 'GET',
                success: function(res, statusText, resObj) {
                var contents= $(res.responseText);
                var title= contents.find('title').text();
                    alert("오예 https 연결을 받는다구여");
                    alert(res);
                    alert(statusText, resObj);

                },
                error: function(res, statusText, errObj) {
                    // can't detect net:: error type
                    alert(res, statusText, errObj);
                    alert("https 안 받는 구질구질한 사이트..");
                }
            });
        }
        // 처음부터 https 연결인 경우에는 체크하지 않음
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        getUrl();
    }
});