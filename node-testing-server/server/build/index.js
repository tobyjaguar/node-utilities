import * as http from 'node:http';
import express from 'express';
import auth from 'basic-auth';
const app = express();
app.use(express.json());
app.get("/", function (req, res) {
    res.writeHead(200);
    console.log(`request received at ${new Date()}`);
    res.end("Root Response");
});
app.get("/get", function (req, res) {
    res.writeHead(200);
    console.log(`get request received at ${new Date()}`);
    res.end("Get Response");
});
app.post("/post", function (req, res) {
    let credentials = auth(req);
    console.log(`credentials: ${JSON.stringify(credentials)}`);
    console.log(`req.body: ${JSON.stringify(req.body)}`);
    res.send(JSON.stringify("POST Request Received"));
});
const options = {};
http.createServer(options, app)
    .listen(3000, () => {
    console.log("Server started at port 3000");
});
//# sourceMappingURL=index.js.map