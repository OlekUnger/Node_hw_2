const http = require('http');
require('dotenv').config();

const server = http.createServer((req, res)=>{
    res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});

    if (req.method === 'GET' && req.url === '/') {
        let step = 0;

        const Interval = setInterval(()=>{
            const date = new Date();
            let year = date.getUTCFullYear(),
                month = date.getUTCMonth()-1,
                day = date.getUTCDate(),
                hour = date.getUTCHours(),
                minutes = date.getUTCMinutes(),
                seconds = date.getUTCSeconds(),
                result = `${day}.${month}.${year} ${hour}:${minutes}:${seconds}`;

            console.log(step+" "+result);
            step++;

            if(step === 5){
                clearInterval(Interval);
                res.end(result);
            }

        }, process.env.INTERVAL);
    }

}).listen(5000);
