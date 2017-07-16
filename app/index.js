const http = require("http")
const express = require("express")
const app = express()
const server = http.createServer(app)
require("express-ws")(app)

const port = process.env.PORT || 3000
const isProduction = process.env.NODE_ENV === "production"

app.engine("hbs", require("express-handlebars")({
  defaultLayout: false,
  extname: "hbs"
}))
app.set("view engine", "hbs")

app.disable("x-powered-by")

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", [
    "default-src 'none'",
    `script-src ${[
      "'self'",
      isProduction ? "https://www.gstatic.com" : "http://www.gstatic.com"
    ].join(" ")}`
  ].join("; "))
  next()
})

app.get("/assets/index.js", require("connect-browserify")({
  entry: "assets/javascripts/index.js",
  extensions: [".js", ".hbs"],
  transforms: [
    require("hbsfy").configure({extensions: ["hbs"]})
  ],
  debug: !isProduction
}))

app.get("/", (req, res) => {
  res.render("index", {
    is_chromecast: req.headers["user-agent"].includes("CrKey")
  })
})

app.ws("/room/:room_id", (ws, req) => {

})

server.listen(port, () => console.log("server listening", server.address()))
