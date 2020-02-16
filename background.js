console.log("background script is running");
chrome.browserAction.onClicked.addListener(buttonClicked);
function buttonClicked (tab)
{
    console.log(tab);
    let msg = {
        text: "hello"
    }
    chrome.tabs.sendMessage(tab.id, msg);
}
