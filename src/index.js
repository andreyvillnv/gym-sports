import express from "express";
import session from "express-session";
import ejs from "ejs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar la sesión
app.use(
  session({
    secret: "123456", // Cambia esto por una clave segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Cambia a `true` si usas HTTPS
  })
);

const dir_name = dirname(fileURLToPath(import.meta.url));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", join(dir_name, "views"));
app.set("view engiene", "ejs");
app.use(indexRoutes);
console.log(dir_name);
app.use(express.static(join(dir_name, "public")));

//app.get('/', (req, res) => res.render('index.ejs'))
app.listen(process.env.PORT || 3000);
console.log(
  `Server is  listening on port  http://localhost:${process.env.PORT || 3000}`
);
