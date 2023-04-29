import * as http from 'node:http';
import express from 'express';
const app = express();
app.get("/", function (req, res) {
    res.writeHead(200);
    res.end("Get Response");
});
app.post("/post", function (req, res) {
    console.log(req.body);
    res.send("POST Request");
});
const options = {};
http.createServer(options, app)
    .listen(3000, () => {
    console.log("Server started at port 3000");
});
//# sourceMappingURL=index.js.map