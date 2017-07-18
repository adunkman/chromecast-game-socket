module.exports = (app) => {

  app.get("/", (req, res) => {
    res.render("index", {
      is_chromecast: req.headers["user-agent"].includes("CrKey")
    })
  })

}
