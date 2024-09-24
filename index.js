require("dotenv").config();
const database = require("./config/database");
const express = require("express");
var path = require("path");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/indexAdmin.route");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");
const flash = require("express-flash");
database.connect();
const app = express();
const port = process.env.PORT;
app.use(methodOverride("_method"));

//TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//App Locas
app.locals.moment = moment;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Flash
app.use(cookieParser("ABPOIWNNOS2D"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(express.static(`${__dirname}/public`));

//Routes
routeAdmin(app);
route(app);
app.get("*", (req, res) => {
  res.render("client/page/errors/404", {
    pageTitle: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
