console.log("content script is running");

var pageNo = 1;
var url;
var origin;
var username;
var csrf;
var referer;
var offset;
var limit;
var dapiid;
var result = [];
var images = [];
var src = [];



let imgprev = document.querySelectorAll('[data-sigil="torpedo-img"]');
for (let i = 0; i < imgprev.length; i++)
{
    if (src.length > 0)
    {
        if (!src.includes(imgprev[ i ].src.split('/v1')[ 0 ]))
        {
            src.push(imgprev[ i ].src.split('/v1')[ 0 ]);
        }
    }
    else
    {
        src.push(imgprev[ i ].src.split('/v1')[ 0 ]);
    }
}
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage (message, sender, sendResponnse)
{
    console.log(message);

    url = message.headers.url.split('mp=')[ 0 ];
    origin = message.headers.requestHeaders[ 0 ].value;
    referer = message.headers.requestHeaders[ 4 ].value;
    username = message.request.requestBody.formData.username[ 0 ];
    limit = message.request.requestBody.formData.limit[ 0 ];
    offset = message.request.requestBody.formData.offset[ 0 ];
    csrf = message.request.requestBody.formData._csrf[ 0 ];
    dapiid = message.request.requestBody.formData.dapiIid[ 0 ];
    checglb();
}
async function checglb ()
{
    var bodystring = `username=${username}&offset=`;
    var bodystring2 = `&limit=${limit}&_csrf=${csrf}&dapiIid=${dapiid}`;
    console.log({
        pageNo: pageNo,
        url: url,
        origin: origin,
        username: username,
        csrf: csrf,
        referer: referer,
        offset: offset,
        limit: limit,
        dapiid: dapiid
    });

    console.log(bodystring)

    var pages = 1;
    while (true)
    {

        let res = await fetch(url + `=${String(pages)}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded"
            },
            "referrer": referer,
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": `${bodystring}${offset}${bodystring2}`,
            "method": "POST",
            "mode": "cors"
        });
        let data = await res.json();
        console.log({
            resno: pages,
            data: data
        });
        offset = String(data.content.next_offset);
        result = result.concat(data.content.results);
        if (!data.content.has_more == true) break; //Were done let's stop this thing

    }

    for (i = 0; i < result.length; i++)
    {
        var temp = null;
        temp = document.createElement('div');
        temp.innerHTML = result[ i ].html;
        try
        {
            images.push(temp.querySelector('[data-sigil="torpedo-img"]').src.split('/v1')[ 0 ]);
        } catch (err)
        {
            console.log(err);
        }
    }
    console.log(images);
    src = src.concat(images);
    console.log(src);
    chrome.runtime.sendMessage({
        data: src
    }, function (response)
    {
        console.dir(response);
    });
}
