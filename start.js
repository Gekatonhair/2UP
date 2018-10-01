const LISTEN_PORT = 80;//VK.api work in localhost only on port 80

const express = require("express");
const app = express();

app.use('/public', express.static(__dirname + "/public")); //share folder 'public'

app.listen(LISTEN_PORT, '0.0.0.0', () => {
    console.log("Server started successfully on port " + LISTEN_PORT);
});

app.get('/', function(req, res) {
    console.log("send index");
    res.sendFile('index.html', { root: './public' });
});