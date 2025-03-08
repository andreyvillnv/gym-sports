import { query, Router } from "express";
import session from "express-session";
import { cifrar, descifrar } from "../cifrado.js";
import {
  bloquearCuenta,
  comprobarCuentaActiva,
  activarCuenta,
  cambiarPass,
  comprobarPass,
  codigoUsuarioGoogleAut,
  codigoGoogleAut,
  verificarGoogleAut,
  citaNutricion,
  idUsuario,
  agregarRutina,
  perfil,
  dataPerfil,
  citaFisio,
  citaPerfilNutricion,
  cambioCitaNutricion,
  nuevoRegistro,
  credencilales,
  intentos,
  agregarIntentos,
  bloqueoCuenta,
} from "../querys-sql.js";
import { usuarioID } from "../id-usuario.js";
import { verificarAutenticacion } from "../authMiddleware.js";
import { enviarCorreoVerificacion } from "../verificacion-de-correo.js";
import { eventos } from "../registrar-eventos.js";
import speakeasy from "speakeasy";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./src/.env" });

const router = Router();

router.get("/", (req, res) => res.render("login.ejs", { error: "" }));

router.get("/login", (req, res) => res.render("login.ejs", { error: "" }));

router.post("/registrarNuevo", async (req, res) => {
  try {
    const pass = await cifrar(req.body.pass);
    const data = {
      correo: req.body.correo,
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      pass: pass,
      celular: req.body.celular,
      fechaNac: req.body.fecha,
      peso: req.body.peso,
      altura: req.body.altura,
      genero: req.body.genero,
      estado: false,
    };
    const validarcorreo = await nuevoRegistro(data);
    if (validarcorreo) {
      await usuarioID(data.correo);
      await enviarCorreoVerificacion(data.correo);
      console.log("Redirigiendo a login...");
      res.render("login.ejs", {
        error: "Verifica tu correo para activar la cuenta",
      });

      //res.render('index.ejs')
    } else if (!validarcorreo) {
      res.render("registro.ejs", { error: "El correo ya está en uso" });
    }
  } catch (error) {}
});

router.get("/verificar/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("correo verificación", req.params);
    console.log("decoded", decoded);

    const result = await activarCuenta(decoded.email);
    //db.execute("UPDATE usuarios SET verificado = 1 WHERE email = ?", [decoded.email]);

    if (result === 1) {
      res.render("login.ejs", {
        error: "Cuenta verificada con éxito. Ya puedes iniciar sesión",
      });
      // res.send("<h1>Cuenta verificada con éxito. Ya puedes iniciar sesión.</h1>");
      // res.redirect('/');
    } else {
      res.render("login.ejs", {
        error: "Se produjo un error en la activación de la cuenta",
      });
      res.send("<h1>Error al verificar la cuenta.</h1>");
    }
  } catch (error) {
    console.log(error);
    res.send("<h1>Token inválido o expirado.</h1>");
  }
});

//evento
router.get("/logout", async (req, res) => {
  try {
    const data = {
      idcliente: req.session.usuario,
      evento: "cierre de sesión",
    };
    await eventos(data);
    req.session.destroy((err) => {
      if (err) {
        return res.send("Error al cerrar sesión");
      }
      res.redirect("/login"); // Redirigir al login después de cerrar sesión
    });
  } catch (error) {}
});

//evento
router.post("/login", async (req, res) => {
  try {
    const data = {
      correo: req.body.correo,
      pass: req.body.pass,
    };
    const estado = await comprobarCuentaActiva(data.correo);
    console.log("estado", estado[0][0].estado);
    if (!estado[0][0].estado) {
      res.render("login.ejs", { error: "La cuenta no está activada" });
      return;
    }
    if (data.correo === "" || data.pass === "") {
      res.render("login.ejs", { error: "Los campos no pueden estar vacios." });
      return;
    }
    const cliente = await bloqueoCuenta(data.correo);
    console.log(cliente);

    if (cliente[0].bloqueo && new Date(cliente[0].bloqueo) > new Date()) {
      const tiempoRestante = Math.ceil(
        (new Date(cliente[0].bloqueo) - new Date()) / 60000
      );
      console.log(
        `Cuenta bloqueada. Intenta nuevamente en ${tiempoRestante} minutos.`
      );
      res.render("login.ejs", {
        error: `Cuenta bloqueada. Intenta nuevamente en ${tiempoRestante} minutos.`,
      });
      return;
    }

    const rows = await credencilales(data.correo);
    const descifrado = await descifrar(data.pass, rows.pass);
    const id_usuario = await idUsuario(data.correo);
    const dataE = {
      idcliente: id_usuario.idcliente,
      evento: "intento de inicio de sesión",
    };
    await eventos(dataE);
    if (descifrado) {
      //console.log("id user= ",id_usuario)
      await intentos(data.correo);
      req.session.usuario = id_usuario.idcliente;
      //Verifica si tiene autenticación en 2 pasos de google aut.
      const estado = await verificarGoogleAut(id_usuario.idcliente);
      console.log("google ", estado);
      if (estado) {
        res.render("ingreso-2fa.ejs", {
          error: "",
          usuario: req.session.usuario,
        });
        return;
        // console.log("entrando")
      } else {
        res.render("index.ejs");
        return;
      }
    } else {
      const nuevosIntentos = cliente[0].intentos + 1;
      let bloqueoTiempo = null;
      if (nuevosIntentos >= 3) {
        bloqueoTiempo = new Date(Date.now() + 60 * 60 * 1000); // Bloqueo por 1 hora
        const dataIntentos = {
          intentos: nuevosIntentos,
          bloqueo: bloqueoTiempo,
          correo: data.correo,
        };
        console.log("data intentos", dataIntentos);
        await bloquearCuenta(dataIntentos);
        res.render("login.ejs", {
          error:
            "Has superado el límite de intentos. Intenta nuevamente en 1 hora.",
        });
        return;
      } else {
        const dataIntentos = {
          intentos: nuevosIntentos,
          correo: data.correo,
        };
        await agregarIntentos(dataIntentos);
        res.render("login.ejs", { error: "Correo o contraseña incorrectos" });
        return;
      }
      //res.render('login.ejs', { error: "Correo o contraseña incorrectos" });
      console.log("intento de login");
      return;
    }
  } catch (error) {
    console.log(error);
    res.render("login.ejs", { error: "El correo no existe" });
  }
});

router.get("/registro", async (req, res) => {
  res.render("registro.ejs", { error: "" });
});

router.get("/cambioContrasena", async (req, res) => {
  res.render("cambiar-contrasena.ejs", { error: "" });
});
router.post("/cambiar", async (req, res) => {
  try {
    const data = {
      correo: req.body.correo,
      pass: req.body.pass,
    };
    const id = await idUsuario(data.correo);
    const passAntiguo = await comprobarPass(id.idcliente);
    const pass = await descifrar(data.pass, passAntiguo[0][0].pass);
    if (pass) {
      res.render("cambiar-contrasena.ejs", {
        error: "No se puede la contraseña anterior",
      });
    } else {
      const pass_ = await cifrar(data.pass);
      const newPass = {
        pass: pass_,
        idcliente: id.idcliente,
      };
      await cambiarPass(newPass);
      res.render("login.ejs", { error: "Contraseña cambiada. Inicia sesión" });
    }
  } catch (error) {
    console.log("error en /cambiar ", error);
    res.render("cambiar-contrasena.ejs", {
      error: "Se a producido un error. El correo ingresado no existe.",
    });
  }
});
router.get("/fisioterapia", verificarAutenticacion, (req, res) => {
  res.render("fisioterapia.ejs", { usuario: req.session.usuario });
});

router.get("/matricula", verificarAutenticacion, (req, res) => {
  res.render("planes-matricula.ejs", { usuario: req.session.usuario });
});
//evento
router.get("/perfil", verificarAutenticacion, async (req, res) => {
  try {
    const id = req.session.usuario;
    const rows = await dataPerfil(id); // Obtener datos del perfil
    const citasNutricion = await citaPerfilNutricion();
    // Obtener citas de nutrición
    const data = {
      idcliente: id,
      evento: "ingreso al perfil",
    };
    await eventos(data);
    console.log(rows);
    console.log("fecha ", citasNutricion);

    // if (!rows.length) {
    //     return res.status(404).send("Perfil no encontrado");
    // }
    const fecha = citasNutricion[0].fecha.toISOString().split("T")[0];
    const fechaNac = rows.fechaNac.toISOString().split("T")[0];
    const hora = citasNutricion[0].fecha.toTimeString().split(" ")[0];
    const cita = fecha + " a las " + hora;
    // Si no hay citas de nutrición, asignar un valor vacío o mensaje
    const citaNutri = citasNutricion.length > 0 ? cita : "Sin cita asignada";

    res.render("perfil.ejs", {
      usuario: req.session.usuario,
      nombre: rows.nombre + " " + rows.apellidos,
      fecha: fechaNac,
      estatura: rows.altura,
      peso: rows.peso,
      citaNutri: citaNutri,
      error: "",
    });
  } catch (error) {
    console.error("Error en la ruta /perfil:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/nutricion", verificarAutenticacion, (req, res) => {
    res.render("nutricion.ejs", { usuario: req.session.usuario });
  });

router.get("/cambiarCitaNutri", verificarAutenticacion, (req, res) => {
  try {
    res.render("cambiar-cita-nutricion.ejs", { usuario: req.session.usuario });
  } catch (error) {}
});

//evento
router.post(
  "/cambioCitaNutricion",
  verificarAutenticacion,
  async (req, res) => {
    try {
      const data = {
        user: 11111,
        fecha: req.body.fecha,
        hora: req.body.hora,
        descripcion: req.body.descripcion,
      };
      console.log(data);
      await cambioCitaNutricion(data);
      const dataE = {
        idcliente: req.session.usuario,
        evento: "cambio de cita nutrición",
      };
      await eventos(dataE);
    } catch (error) {}
    const data = {
      user: 1,
      fecha: req.body.fecha,
      hora: req.body.hora,
      descripcion: req.body.descripcion,
    };

    res.render("cita-nutricion.ejs", {
      usuario: req.session.usuario,
      fecha: data.fecha,
      hora: data.hora,
    });
  }
);

//evento
router.get("/home", verificarAutenticacion, (req, res) => {
  try {
    const data = {
      idcliente: req.session.usuario,
      evento: "ingreso al home",
    };
    res.render("index.ejs", { usuario: req.session.usuario });
  } catch (error) {}
});

router.get("/entrenamientosPesas", verificarAutenticacion, (req, res) => {
  res.render("entrenamientosPesas.ejs", { usuario: req.session.usuario });
});

router.get("/bajarPeso", verificarAutenticacion, (req, res) => {
  res.render("bajarPeso.ejs", { usuario: req.session.usuario });
});

router.get("/3-dias-bajarPeso", verificarAutenticacion, (req, res) => {
  res.render("3-dias-bajar-peso.ejs", { usuario: req.session.usuario });
});

router.post("/citaNutricion", verificarAutenticacion, async (req, res) => {
  try {
    const data = {
      user: 11111,
      fecha: req.body.fecha,
      hora: req.body.hora,
      descripcion: req.body.descripcion,
    };
    console.log(data);
    await citaNutricion(data);
  } catch (error) {}
  const data = {
    user: 1,
    fecha: req.body.fecha,
    hora: req.body.hora,
    descripcion: req.body.descripcion,
  };
  res.render("cita-nutricion.ejs", {
    usuario: req.session.usuario,
    fecha: data.fecha,
    hora: data.hora,
  });
});

router.post("/citaFisio", verificarAutenticacion, async (req, res) => {
  try {
    const data = {
      user: 1,
      fecha: req.body.fecha,
      hora: req.body.hora,
      descripcion: req.body.descripcion,
    };
    await citaFisio(data);
  } catch (error) {}
  const data = {
    user: 1,
    fecha: req.body.fecha,
    hora: req.body.hora,
    descripcion: req.body.descripcion,
  };
  res.render("cita-fisioterapia.ejs", {
    usuario: req.session.usuario,
    fecha: data.fecha,
    hora: data.hora,
  });
});

router.post("rutina-3-bajar-peso", verificarAutenticacion, async (req, res) => {
  try {
    const data = {
      user: 1111,
      rutina: "3DBP",
    };
    await agregarRutina(data);
  } catch (error) {}
});

//Google Authenticator

// Ruta para generar el secreto activarGoogleAut
router.get(
 "/activarGoogleAut", 
 verificarAutenticacion, 
 async (req, res) => {
  try {
    const estado = await verificarGoogleAut(req.session.usuario);
    if (estado) {
      const id = req.session.usuario;
      const rows = await dataPerfil(id); // Obtener datos del perfil
      const citasNutricion = await citaPerfilNutricion(); // Obtener citas de nutrición

      console.log(rows);
      console.log("fecha ", citasNutricion);

      // if (!rows.length) {
      //     return res.status(404).send("Perfil no encontrado");
      // }
      const fecha = citasNutricion[0].fecha.toISOString().split("T")[0];
      const fechaNac = rows.fechaNac.toISOString().split("T")[0];
      const hora = citasNutricion[0].fecha.toTimeString().split(" ")[0];
      const cita = fecha + " a las " + hora;
      // Si no hay citas de nutrición, asignar un valor vacío o mensaje
      const citaNutri = citasNutricion.length > 0 ? cita : "Sin cita asignada";

      res.render("perfil.ejs", {
        usuario: req.session.usuario,
        nombre: rows.nombre + " " + rows.apellidos,
        fecha: fechaNac,
        estatura: rows.altura,
        peso: rows.peso,
        citaNutri: citaNutri,
        error: "La autenticación de Google ya está activada",
      });
    }
    let codigo = null;
    const secret = speakeasy.generateSecret({ length: 20 });
    codigo = secret.base32; // Guardar el secreto
    await codigoGoogleAut(req.session.usuario, codigo);
    res.render("googleAut.ejs", { secret: codigo });
  } catch (error) {}
  // Enviar el secreto al frontend
});

router.post(
  "/activarSevicioGoogleAut",
  verificarAutenticacion,
  async (req, res) => {
    try {
      const { codigo } = req.body;

      await codigoGoogleAut(req.session.usuario, codigo);
      console.log("Hecho");
      const id = req.session.usuario;
      const rows = await dataPerfil(id); // Obtener datos del perfil
      const citasNutricion = await citaPerfilNutricion(); // Obtener citas de nutrición

      console.log(rows);
      console.log("fecha ", citasNutricion);

      // if (!rows.length) {
      //     return res.status(404).send("Perfil no encontrado");
      // }
      const fecha = citasNutricion[0].fecha.toISOString().split("T")[0];
      const fechaNac = rows.fechaNac.toISOString().split("T")[0];
      const hora = citasNutricion[0].fecha.toTimeString().split(" ")[0];
      const cita = fecha + " a las " + hora;
      // Si no hay citas de nutrición, asignar un valor vacío o mensaje
      const citaNutri = citasNutricion.length > 0 ? cita : "Sin cita asignada";

      res.render("perfil.ejs", {
        usuario: req.session.usuario,
        nombre: rows.nombre + " " + rows.apellidos,
        fecha: fechaNac,
        estatura: rows.altura,
        peso: rows.peso,
        citaNutri: citaNutri,
        error: "",
      });
    } catch (error) {}
  }
);
// Ruta para verificar el código 2FA
router.post("/2fa/verify", verificarAutenticacion, async (req, res) => {
  try {
    const codigo = [
      req.body.valor0,
      req.body.valor1,
      req.body.valor2,
      req.body.valor3,
      req.body.valor4,
      req.body.valor5,
    ];
    const token = Number(codigo.join(""));

    const codigoUsario = await codigoUsuarioGoogleAut(req.session.usuario);
    console.log("Codigo", codigoUsario[0][0].googleauthen);
    const verified = speakeasy.totp.verify({
      secret: codigoUsario[0][0].googleauthen,
      encoding: "base32",
      token: token,
    });
    console.log("Codigo, verificado", codigoUsario, verified);
    if (verified) {
      res.redirect("/home");
    } else {
      res.render("ingreso-2fa.ejs", {
        usuario: req.session.usuario,
        error: "Código no válido",
      });
    }
  } catch (error) {}
});

export default router;
