import * as http from 'node:http';

async function httpGet(hostname: string, path: string, headers: any) {
    return new Promise(async (resolve, reject) => {
      const options = {
        hostname: hostname,
        path: path,
        port: 3000,
        method: 'GET',
        headers: headers
      };
  
      let body: any[] = [];
  
      const req = http.request(options, res => {
        if (res?.statusCode) {
            if (res.statusCode < 200 || res.statusCode > 299) {
                return reject(new Error(`HTTP status code ${res.statusCode}`))
            }
        }
        else {
            return reject(new Error(`HTTP_FAILED`));
        }
        res.on('data', (chunk: any) => body.push(chunk));
        res.on('end', () => {
          const data = Buffer.concat(body).toString();
          resolve(data);
        });
      });

      req.on('error', (error: any) => {
        console.error(`ERROR httpGet: ${error}`);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy()
        reject(new Error('timed out'))
      })
  
      req.end();

    });  
}
  
  
async function httpPost(hostname: string, path: string, body: any) {
    let username = 'username';
    let password = 'pissword';
    let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            path: path,
            port: 3000,
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': auth
            }
        };
  
        const req = http.request(options, (res: any) => {
            if (res?.statusCode) {
                if (res.statusCode < 200 || res.statusCode > 299) {
                    return reject(new Error(`HTTP status code ${res.statusCode}`))
                }
            }
            else {
                return reject(new Error(`HTTP_FAILED`));
            }

            let data: any[] = [];
            res.on('data', (chunk: any) => {
                data.push(chunk);
            });

            res.on('end', () => {
                let resBody = Buffer.concat(data).toString();
                switch(res.headers['content-type']) {
                    case 'application/json':
                        resBody = JSON.parse(resBody);
                        break;
                }
                resolve(resBody)
            });
        }); // end request

        req.on('error', (error: any) => {
            console.error(`ERROR httpPost: ${error}`);
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy()
            reject(new Error('timed out'))
        });

        req.write(body);
      
        req.end();
    });  
}


(async () => {
    try{
        const getRes = await httpGet('127.0.0.1', '/get', {});
        console.log(`getRes: ${getRes}`);
        let payload = JSON.stringify({
            "orderId": '12345',
            "unused": "unused"
        });
        const postRes = await httpPost('127.0.0.1', '/post', payload);
        console.log(`postRes: ${postRes}`);
    }
    catch (error: any) {
        console.error(error);
    }
})();