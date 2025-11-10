const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const rootDir = require("./util/path");
const novelRouter = require("./routes/novel");

// Set Template Engine
app.set("view engine", "ejs");
app.set("views", "views");

// Set JSON and body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set Public CSS and JS Files Locations
app.use(express.static(path.join(rootDir, "public")));

// Set Public Assets Files Locations
app.use(express.static(path.join(rootDir, "assets")));

// use Router
app.use("/",novelRouter);

// 404 Page
app.use((req, res) => {
  res.status(404).render("404", {pageTitle: "404", activePage: '404'});
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
