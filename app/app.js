require("dotenv").config();
const path = require("path");
const express = require("express");
const router = require("./routes/router");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", router);
app.use((req, res) => res.status(404).render("pages/404"));

const porta = process.env.PORT || 3000;
app.listen(porta, () => console.log("Grappling Flow em http://localhost:" + porta));
