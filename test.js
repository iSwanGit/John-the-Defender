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
                    var msg= "";
                    if (details.error === "net::ERR_ABORTED") { /* pass */ }
                    else if (errFlag == false) {
                        // net:: error detect (details.error (string))
                        if (details.error === "net::ERR_INSECURE_RESPONSE") {
                            msg= "경고: 이 페이지에 보안 문제가 있습니다!\n"+
                            "해커가 중간에서 연결을 가로채고 있거나, 보안 인증서에 문제가 있을 수 있습니다.\n"+
                            "올바른 도메인으로 접속하고 있는 지 점검을 권장합니다.\n"+
                            details.error;
                            alert(msg);

                            var msg2= "https로 연결하여 자세한 내용을 보시려면 확인을 눌러주십시오.\n"+
                                    "확인 버튼을 눌러도 이동이 안된다면 주소창에 직접 https를 쳐 주세요..";
                            var sel= confirm(msg2);
                            if (sel == true) {
                                // https
                                //alert(reqUrl);
                                chrome.tabs.sendMessage(tabs[0].id, {greeting: "redirect", url: reqUrl});
                                // 확장기능 고려: 예외사이트 관리
                                // https 해도 안 들어가지는 놈이 있음
                            }
                        }
                        else if (details.error === "net::ERR_CONNECTION_REFUSED") {
                            msg= "주의: 이 페이지는 보안 연결을 제공하지 않습니다.\n"+
                            "입력하여 전송한 정보가 제3자에게 노출될 수 있습니다.\n"+
                            details.error;
                            alert(msg);                        
                        }
                        // 200 OK: handle at ajax success area
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
                //alert(resObj.status);
                var msg= "이 페이지는 https 보안 연결을 지원합니다.\n"+
                "해커가 연결을 가로채고 있을 수 있습니다. https로 연결하시겠습니까?\n"+
                "https 연결에 문제가 발생하면 뒤로가기를 통해 다시 되돌아오시기 바랍니다.";
                var sel= confirm(msg);
                if (sel == true) {
                    // https
                    chrome.tabs.sendMessage(tabs[0].id, {greeting: "redirect", url: reqUrl});
                    // 확장기능 고려: 예외사이트 관리
                    // http->https(302)->http 일방적으로 제공하는 경우(saramin)
                    // http->https css깨지는 경우(tistory)
                }
                },
                //timeout: 5000
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

