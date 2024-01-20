const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + "/dist/ebay-shop")); // 请确保路径正确

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/ebay-shop/index.html")); // 请确保路径正确
});

app.listen(process.env.PORT || 8080);
