const http = require("http");
const fs = require("fs");
const req = require('request');
let tacToken = "";
const headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
};
tacLoop();
(async function main() {
    try {
        const jsCode = fs.readFileSync("./bytedcode.js").toString();
        fs.readFile("./index.html", "utf8", function(err, html) {
            if (err) {
                throw err;
            }
            http
                .createServer(function(request, response) {
                    html = html.replace("<script>TACTOKEN</script>", tacToken);
                    html = html.replace("SIGNATURE_FUNCTION", jsCode);
                    response.writeHeader(200, {
                        "Content-Type": "text/html"
                    });
                    response.write(html);
                    response.end();
                })
                .listen(8080, '127.0.0.1')
                .on("listening", function() {
                    console.log("TikTok Signature server started");
                });
        });
    } catch (err) {
        console.error(err);
    }
})();
async function tacLoop() {
    while (true) {
        tacToken = await getTac();
        await sleep(10000);
    }
}
async function getTac() {
    const response = await request({
        uri: 'https://www.tiktok.com/trending',
        headers
    });
    const body = response.body;
    const regex = body.match(new RegExp("<script>tac='" + "(.+?)" + "'</script>", "ig"));
  console.log(regex);
  return regex;
    //return returnz;
}

function sleep(t, v) {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, v), t);
    });
}

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