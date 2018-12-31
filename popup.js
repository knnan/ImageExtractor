var msg = {
    headers: undefined,
    request: undefined,
    response: undefined
};

document.getElementById('button1').addEventListener('click', (e) =>
{
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
});



// fuction to get the request HEADERS
getHeaders = (filter = {
    urls: [ "*://www.deviantart.com/dapi/*" ]
}, options = [ "blocking", "requestHeaders" ]) =>
{
    return new Promise((accept, reject) =>
    {
        chrome.webRequest.onBeforeSendHeaders.addListener(accept, filter, options);
    });
};


// fuction to get the request BODY
getResponse = (filter = {
    urls: [ "*://www.deviantart.com/dapi/*" ]
}, options = [ "blocking", "requestBody" ]) =>
{
    return new Promise((accept, reject) =>
    {
        chrome.webRequest.onBeforeRequest.addListener(accept, filter, options);
    });
};


//function to get current Tab
getTab = (par = {
    active: true,
    currentWindow: true
}) =>
{
    return new Promise((accept, reject) =>
    {
        chrome.tabs.query(par, accept);
    });
};

async function getDetails ()
{

    const [ Headers, Request, tab ] = await Promise.all([ this.getHeaders(), this.getResponse(), this.getTab() ]);
    msg.headers = Headers;
    msg.request = Request;
    chrome.tabs.sendMessage(tab[ 0 ].id, msg);
    chrome.webRequest.onBeforeSendHeaders.removeListener(this.getHeaders);
    chrome.webRequest.onBeforeRequest.removeListener(this.getResponse);
}
getDetails();
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse)
{
    console.log(message);
    imagediv = document.getElementById('image-gallery');
    output1 = '';
    output = '';
    for (let i = 0; i < message.data.length; i++)
    {
        output1 += `<div class="col s4">            
                <img src=${message.data[ i ]}  class="responsive-img z-depth 2"/>
                </div>`;
        output += `<div class="col s4">
<div class="card ">
                <div class="card-image">
                    <img src=${message.data[ i ]} alt="" class="downloadbutton"/>
                </div>
                 <a class="btn-floating halfway-fab waves-effect waves-light  ">
               <i class="tiny material-icons downloadbutton">arrow_downward</i>
               </a>
            </div>
            </div>`;
    }
    imagediv.innerHTML = output;

    var elementsArray = document.getElementsByClassName('downloadbutton');
    for (let i = 0; i < elementsArray.length; i++)
    {

        elementsArray[ i ].addEventListener("click", function (e)
        {
            //this function does stuff
            console.log('download INitiated');
            console.log('Event', e.target.currentSrc);
            chrome.downloads.download({
                url: String(e.target.currentSrc),
                saveAs: false
            });
        });
    }
    document.getElementById('button2').addEventListener('click', (e) =>
    {
        images = document.querySelectorAll('img');
        for (let i = 0; i < images.length; i++)
        {
            downloadsrc = images[ i ].currentSrc;
            chrome.downloads.download({
                url: String(downloadsrc),
                saveAs: false
            });

        }
    });

    sendResponse({
        data: "I am fine, thank you. How is life in the background?"
    });
});

