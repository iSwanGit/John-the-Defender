
function Hello() {
    alert("SSL Strip check");
}
/*
document.addEventListener("DOMContentLoaded", function() { 
     alert("Page Loaded");
}, true);
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //alert(tabId);
    if (changeInfo.status == 'complete') {
        Hello();
    }
});

//chrome.webNavigation.onCompleted.addListener()

//window.addEventListener("load", Hello);
//window.onload= Hello;
//document.onload= Hello;
//$(document).ready(function(){
//    Hello();
//});