var curUrl;
var reqUrl;

var errFlag= false;

function getUrl() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        tab= tabs[0];
        curUrl= tab.url;
        
        chrome.webRequest.onErrorOccurred.addListener(
                function(details) {
                    if (errFlag == false) {
                        // net:: error detect (details.error (string))
                        // TODO: 에러별 구분
                        alert("error: " + details.error);
                        errFlag= true;
                    }

                }, {
                    urls: ['*://*/*'],
                    types: ['xmlhttprequest']
                }
            );

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
                    //alert(res);
                    alert(resObj.getAllResponseHeaders());
                    alert(resObj.responseText);
                    alert(statusText, resObj);
                }
            });
            
        }
        
        // 처음부터 https 연결인 경우에는 체크하지 않음
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        errFlag= false;
        getUrl();
    }
});

