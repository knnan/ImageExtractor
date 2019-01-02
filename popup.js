var msg = {
    headers: undefined,
    request: undefined,
    response: undefined
};
var Folder;


document.getElementById('refresh').addEventListener('click', (e) => {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
    {
        chrome.tabs.update(tabs[ 0 ].id, { url: tabs[ 0 ].url });
    });
});

document.querySelector('form').addEventListener('submit', (e) =>
{
    const formData = new FormData(e.target);
    console.log(formData.get('subfolder'));
    Folder = String(formData.get('subfolder'))+"/";
    e.preventDefault();
});

chrome.downloads.onDeterminingFilename.addListener(getfiletype);
function getfiletype (item, suggest)
{
    console.log("This is the file type");
    console.log(item);
    if (Folder == undefined)
    {
        Folder = "";
        }
    newFilename = String(Folder)+ String(item.filename);
    suggest({ filename: newFilename });
    console.log("finished naming", newFilename);
}





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
    M.toast({ html: 'parsed!' })
    chrome.webRequest.onBeforeSendHeaders.removeListener(this.getHeaders);
    chrome.webRequest.onBeforeRequest.removeListener(this.getResponse);
}
getDetails();
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse)
{
    console.log(message);
    console.log(message.data.src.length);
    document.getElementById("totalimages").innerText = String(message.data.src.length);
    console.log(document.getElementById("totalimages"));
    imagediv = document.getElementById('image-gallery');
    output1 = '';
    output = '';
    for (let i = 0; i < message.data.src.length; i++)
    {
        output1 += `<div class="col s4">            
                <img src=${message.data.src[ i ]}  class="responsive-img z-depth 4 "/>
                </div>`;
        output += `<div class="col s4">
<div class="card ">
                <div class="card-image">
                    <img src=${message.data.src[ i ]}  class="downloadbutton1"   alt="${message.data.titles[ i ]}"  />
                    
                </div>
                 <a class="btn-floating halfway-fab waves-effect waves-light  "   >
               <i class="tiny material-icons downloadbutton"   customattr=${message.data.src[ i ]}  imagename="${message.data.titles[ i ]}" >arrow_downward</i>
               </a>
              
            </div>
            </div>`;
    }
    imagediv.innerHTML = output;

    var imageElementarray = document.getElementsByClassName('downloadbutton1');
    var buttonarray = document.getElementsByClassName('downloadbutton');
    for (let i = 0; i < imageElementarray.length; i++)
    {

        imageElementarray[ i ].addEventListener("click", function (e)
        {
            //this function does stuff
            console.log('download INitiated');
            var eventobj = e.target.attributes;
            chrome.downloads.download({
                url: String(e.target.attributes.src.value),
                saveAs: false
            });
        });
        buttonarray[ i ].addEventListener("click", function (e)
        {
            console.log('Event', e.target);
            //this function does stuff
            var eventobj = e.target.attributes;
            url1 = eventobj.customattr.value;

            
            console.log('download INitiated');
            chrome.downloads.download({
                url: String(url1),
                saveAs: false
            });
        });
    }
    document.getElementById('button2').addEventListener('click', (e) =>
    {
        images = document.querySelectorAll('img');
        var tempfile=Folder;
        for (let i = 0; i < images.length; i++)
        {
            downloadsrc = images[ i ].src;

        
            console.log("Batch download", Folder);

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

