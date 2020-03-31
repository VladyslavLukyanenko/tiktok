const req = require('request');
const Signer = require("./Signer");
const headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
};
async function logic() {
while(true){
  const res = await getProfileDetails('ghostaio');
    const {
      statusCode,
        userInfo: {
            user: {
                id,
                secUid
            },
            stats: {
                videoCount
            }
        }

    } = res;
  const profile = await getProfileContents(secUid, id);
    profile.body.itemListData.forEach((item) => {
     console.log(item.itemInfos.video.urls[0]);
    });
       await sleep(1000);
}
}
async function getProfileDetails(profile) {
    const uri = await sign(`https://m.tiktok.com/api/user/detail/?uniqueId=${profile}&language=en`)
    const response = await request({
        uri,
        headers
    });
    return JSON.parse(response.body);
};
async function getProfileContents(secUid, id) {
    const uri = await sign(`https://m.tiktok.com/share/item/list?secUid=${secUid}&id=${id}&type=1&count=30&minCursor=0&maxCursor=0&shareUid=&lang=`)
    const response = await request({
        uri,
        headers
    });
    return JSON.parse(response.body);
};
async function sign(url) {
    const signer = new Signer();
    await signer.init();
    const signature = await signer.sign(url);
    await signer.close();
    return url + "&_signature=" + signature;
};
function request(items) {
    return new Promise(function(resolve, reject) {
        req(items, function(error, res, body) {
            if (!error) {
                resolve({
                    res: res,
                    error: error,
                    body: body
                });
            } else {
                reject(error);
            }
        });
    });
};
function sleep(t, v) {
   return new Promise(resolve => {
       setTimeout(resolve.bind(null, v), t);
   });
}
logic();