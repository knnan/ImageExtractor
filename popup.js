var msg = {
    headers: undefined,
    request: undefined,
    response: undefined,
    final_data:undefined
};
var Folder;
var glbmessage = {};
function downloadit(dourl)
{
  chrome.downloads.download({
                url: String(dourl),
                saveAs: false
            });
}


document.getElementById('refresh').addEventListener('click', (e) => {
let d = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/40b917ca-54f0-4d4a-b0e7-b3034357dc15/d6v5rki-0d8b2f93-34a1-4529-a88d-3b0f2f39d797.jpg/v1/fit/w_150,h_150,q_70,strp/tentacel_beast_by_pyxartz_d6v5rki-150.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4MCIsInBhdGgiOiJcL2ZcLzQwYjkxN2NhLTU0ZjAtNGQ0YS1iMGU3LWIzMDM0MzU3ZGMxNVwvZDZ2NXJraS0wZDhiMmY5My0zNGExLTQ1MjktYTg4ZC0zYjBmMmYzOWQ3OTcuanBnIiwid2lkdGgiOiI8PTE5ODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.GAED2QZOrv9eIll6UsDeN2_v8voB3z5KtgJ_OgeurJw";
  chrome.downloads.download({
                url: d,
                saveAs: false
            });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
    {
        console.log("sldjfkjlasdjljsd;j;lsjdfjl;jasldjlksjdflk")
        chrome.tabs.update(tabs[ 0 ].id, { url: tabs[ 0 ].url });

        // chrome.tabs.reload(tabs[0].id);
    });
});


document.addEventListener('DOMContentLoaded', (event) => {
     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
    {
        console.log("Reloading the tab")
        chrome.tabs.update(tabs[ 0 ].id, { url: tabs[ 0 ].url });

        // chrome.tabs.reload(tabs[0].id);
    });
    console.log('DOM fully loaded and parsed');
});

document.querySelector('form').addEventListener('submit', (e) =>
{
    const formData = new FormData(e.target);
    console.log(formData.get('subfolder'));
    Folder = String(formData.get('subfolder'))+"/";
    e.preventDefault();
});
// chrome.downloads.onDeterminingFilename.addListener(getfiletype);

function getfiletype (item, suggest)
{
    console.log("This is the file type");
    console.log(item);
    var index = glbmessage.data.src.indexOf(item.finalUrl);
    let filename = glbmessage.data.titles[ index ].trim().replace(/ |\./g, "_");

    if (Folder == undefined)
    {
        Folder = "";
    }
    if (filename == undefined)
    {
        filename = "";
    }
    newFilename = String(Folder) + String(filename) + "." + String(item.filename).split(".")[ 1 ];

    // newFilename = String(Folder)+ String(item.filename);
    suggest({ filename: newFilename });
    console.log("finished naming", newFilename);
}




// fuction to get the request HEADERS
getHeaders = (filter = {
    urls: [ "*://www.deviantart.com/*" ]
}, options = [ "blocking", "requestHeaders" ]) =>
{
    return new Promise((accept, reject) =>
    {
        chrome.webRequest.onBeforeSendHeaders.addListener(accept, filter, options);
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



async function getData()
{
     const [ Headers, tab ] = await Promise.all([ this.getHeaders(),this.getTab() ]);
    msg.headers = Headers;
    res = await axios.get("https://www.deviantart.com/pyxartz/gallery");
    data = res.data;
let doc = new DOMParser().parseFromString(data, 'text/html');

const regExp = /\(([^);]+)\)/;
let all_config_strings = doc.querySelectorAll('script')[10].text.split('\n');
let config_string =  all_config_strings.filter( ele => {return ele.includes('window.__INITIAL_STATE__')});
let init = config_string[0].indexOf('JSON.parse(');
let fin = config_string[0].indexOf(');');
let final_string = '"'+config_string[0].substr(init+12,fin-init-12)
let answer = JSON.parse(JSON.parse(final_string));
let devi  = answer['@@entities']['deviation']
let all_src = [];
let medias = []
for(let d in devi)
{
media = devi[d].media;
// console.log(media.token[0]);
 let baseURL = media.baseUri;
    let prettyName = media.prettyName;
    let token = media.token[0];
    let pre_type = await media.types.filter( async t => {return t.t == 'preview'});
    // console.log(pre_type);
    let type_name = pre_type[0].c.replace('<prettyName>',prettyName)


    let URL = `${baseURL}/${type_name}?token=${token}`
    src = {}
    src.URL = URL;
    src.title = media.prettyName.split('-')[0];
    all_src.push(src);

}
msg.final_data = all_src;
 chrome.tabs.sendMessage(tab[ 0 ].id, msg);
    M.toast({ html: 'parsed!' })
    return msg;

}

async function getDetails ()
{

    const [ Headers, tab ] = await Promise.all([ this.getHeaders(),this.getTab() ]);
    msg.headers = Headers;
    await this.getData();

    
    msg.request = Request;
    console.log('dksla;fsjd')
    console.log('final_result'.glbmessage);
    msg.data = glbmessage;
  
    chrome.tabs.sendMessage(tab[ 0 ].id, msg);
    M.toast({ html: 'parsed!' })
    // chrome.webRequest.onBeforeSendHeaders.removeListener(this.getHeaders);
}
// getData().then(res => console.log('ls msg is ',res)).catch(err => consoel.log(err));

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse)
{
    glbmessage = message;
    console.log('Returned message from content',message);

});


async function testagain()
{
    let testresult = await getData();
    console.log('aa test restu'.testresult);
}



function displayOutput(img_obj)
{

   img_src = img_obj.final_data;
    document.getElementById("totalimages").innerText = String(img_src.length);
    console.log(document.getElementById("totalimages"));
    imagediv = document.getElementById('image-gallery');
    output1 = '';
    output = '';
    for (let i = 0; i < img_src.length; i++)
    {
        output1 += `<div class="col s4">            
                <img src=${img_src[ i ].URL}  class="responsive-img z-depth 4 "/>
                </div>`;
        output += `<div class="col s4">
<div class="card ">
                <div class="card-image">
                    <img src=${img_src[i].URL}  class="downloadbutton1"   alt="${img_src[i].title}"  />
                    
                </div>
                 <a class="btn-floating halfway-fab waves-effect waves-light  "   >
               <i class="tiny material-icons downloadbutton"   customattr=${img_src[i].URL}  imagename="${img_src[i].title}" >arrow_downward</i>
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

            console.log(url1);
            console.log('download INitiated');
            downloadit();
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

}
getData().then(res => {
displayOutput(res)
}).catch(err =>console.log(err));
