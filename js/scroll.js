chrome.tabs.query({
    active: true,
    currentWindow: true
}, gottab);
function gottab (tab)
{
    console.log(tab);
    chrome.tabs.executeScript(tab.id, { code: "window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);" }, function (response)
    {
        console.log('script executed');
    });


};
chrome.tabs.query({
    active: true,
    currentWindow: true
}, gottab);
function gottab (tab)
{
    console.log(tab);
    chrome.tabs.executeScript(tab.id, { code: "window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);" }, function (response)
    {
        console.log('script executed');
    });


};
