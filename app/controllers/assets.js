const isProduction = process.env.NODE_ENV === "production"

module.exports = (app) => {

  app.get("/assets/index.js", require("connect-browserify")({
    entry: "app/assets/javascripts/index.js",
    extensions: [".js", ".hbs"],
    transforms: [
      require("hbsfy").configure({extensions: ["hbs"]})
    ],
    debug: !isProduction
  }))

  app.get("/assets/index.css", require("express-sass-middleware")({
    file: "app/assets/stylesheets/index.sass",
    watch: !isProduction,
    precompile: isProduction,
    indentedSyntax: true
  }))

}
