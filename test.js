var curUrl;
var reqUrl;

var errFlag= false;
var pwForms= [];

function start() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        var tab= tabs[0];
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
                    
                },
                timeout: 5000
            });
            
        }
        
        // 처음부터 https 연결인 경우에는 체크하지 않음
    });
}

// sleep method
function sleep(time) {
    return new Promise((resolve)=> setTimeout(resolve, time));
}

// onUpdated: start trigger
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
    if (changeInfo.status == 'complete') {
        // js internal page loading을 감안.. 특히 icns! sleep없으면 0나온다
        sleep(1000).then(()=>{
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
                    pwForms= response.forms;
                    //alert(pwForms.length);
                
                    if (pwForms.length > 0) {
                        errFlag= false;
                        start();
                    }
                });
            
            });
        })
    }
});

