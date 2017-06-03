var curUrl;
var reqUrl;

function getUrl() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        curUrl= tabs[0].url;
        //alert(curUrl);
        if (!curUrl.search('http://')) {    // http: true, https: false
            reqUrl= curUrl.replace("http://", "https://");
            //alert(reqUrl);           
            //test();
        }
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        getUrl();
        //alert("asdf",chrome.webRequest.HttpHeaders);
        alert("?");
        
        // 삽질중 이거 안돌아감
        $.ajax({
            url: reqUrl,
            type: 'GET',
            success: function(res) {
                var contents= $(res.responseText);
                var title= contents.find('title').text();
                alert("오씨발 됐다");
            },
            error: function() {
                alert("SSㅣ발");
            }
        });
    }
});

function test() {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
             // do something; the request has completed
        }
    }
    xhr.open("GET", reqUrl, true );
    //alert(xhr.readyState);
    //alert(xhr.status);
    //xhr.send();
    
}

