import { query, Router } from "express";
import session from 'express-session';
import {cifrar, descifrar} from '../cifrado.js'
import { citaNutricion, agregarRutina, perfil, dataPerfil, citaFisio, citaPerfilNutricion, cambioCitaNutricion, nuevoRegistro, credencilaes} from "../querys-sql.js";
import { usuarioID } from "../id-usuario.js";
const router = Router();


router.get("/", (req, res) =>res.render("login.ejs"))  


router.get('/nutricion', (req, res) => {
    res.render('nutricion.ejs'); 
});

router.post('/registrarNuevo', async (req, res) => {

        try {
        const pass = await cifrar(req.body.pass)
        const data = {
            correo:req.body. correo,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            pass:pass,
            celular: req.body.celular,
            fechaNac:req.body.fecha,
            peso: req.body.peso,
            altura: req.body.altura,
            genero: req.body.genero
          };
          await nuevoRegistro(data);
          await usuarioID(data.correo); 
          
         
    } catch (error) {
        
    }
    res.render('index.ejs')
    
});

router.post('/login', async (req, res) => {
    
    try {
        const data = {
            correo: req.body.correo,
            pass: req.body.pass
        }
       // console.log("data ", data)
        const rows = await credencilaes(data.correo)
        //console.log("pass ", rows.pass)
        const descifrado = await descifrar(data.pass, rows.pass)
       // console.log(descifrado)
        if (descifrado) {
            res.render('index.ejs');              
        } else {
            res.render('login.ejs', { error: "Correo o contraseña incorrectos" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }    
});

router.get('/registro', async (req, res) => {
    res.render("registro.ejs")
    // try {
    //     const data = {
    //         user: req.body.correo,
    //         pass: req.body.pass
    //     }
      
    //     const rows = await perfil(data)
    //     console.log(rows)
    //     if (rows.length > 0) {
            
    //         const id = rows[0].id;
    //         res.render('index.ejs', {id}); 
         
       
    //     } else {
    //         res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    //     }
      
    // } catch (error) {
        
    // }
    
});
router.get('/fisioterapia', (req, res) => {
    res.render('fisioterapia.ejs'); 
});
router.get('/matricula', (req, res) => {
    res.render('planes-matricula.ejs'); 
});

// router.get('/perfil', async (req, res) => {
//     try {
//         const rows = await dataPerfil()
//         console.log(rows)
//         res.render('perfil.ejs', {nombre: rows[0].nombre +' '+ rows[0].apellidos, fecha: rows[0].fechaNac, estatura: rows[0].altura, peso : rows[0].peso }); 
//     } catch (error) {
        
//     }

   
// });

router.get('/perfil', async (req, res) => {
    try {

        const rows = await dataPerfil();  // Obtener datos del perfil
        const citasNutricion = await citaPerfilNutricion();  // Obtener citas de nutrición
        
        console.log(rows);
        console.log("fecha ",citasNutricion);

        if (!rows.length) {
            return res.status(404).send("Perfil no encontrado");
        }
        const fecha = citasNutricion[0].fecha.toISOString().split("T")[0];
        const hora = citasNutricion[0].fecha.toTimeString().split(" ")[0];
        const cita = fecha + ' a las ' + hora 
        // Si no hay citas de nutrición, asignar un valor vacío o mensaje
        const citaNutri = citasNutricion.length > 0 ? cita : "Sin cita asignada";
        
        res.render('perfil.ejs', { 
            nombre: rows[0].nombre + ' ' + rows[0].apellidos,
            fecha: rows[0].fechaNac,
            estatura: rows[0].altura,
            peso: rows[0].peso,
            citaNutri: citaNutri  
        });

    } catch (error) {
        console.error("Error en la ruta /perfil:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/cambiarCitaNutri', (req,res)=>{
    try {
        res.render('cambiar-cita-nutricion.ejs');
    } catch (error) {
        
    }

})

router.post('/cambioCitaNutricion', async(req,res)=>{
    try {
        const data = {
            user: 11111,
            fecha: req.body.fecha,
            hora: req.body.hora,
            descripcion: req.body.descripcion
          };
          console.log(data)
          await cambioCitaNutricion(data)

    } catch (error) {
        
    }
    const data = {
        user: 1,
        fecha: req.body.fecha,
        hora: req.body.hora,
        descripcion: req.body.descripcion
      };
   
    res.render('cita-nutricion.ejs', {fecha : data.fecha, hora: data.hora});

})
router.get('/home', (req, res) => {
    res.render('index.ejs'); 
});

router.get('/entrenamientosPesas', (req, res) => {
    res.render('entrenamientosPesas.ejs'); 
});


router.get('/bajarPeso', (req, res) => {
    res.render('bajarPeso.ejs'); 
});

router.get('/3-dias-bajarPeso', (req, res) => {
    res.render('3-dias-bajar-peso.ejs'); 
});

router.post('/citaNutricion',  async(req, res) => {
    try {
        const data = {
            user: 11111,
            fecha: req.body.fecha,
            hora: req.body.hora,
            descripcion: req.body.descripcion
          };
          console.log(data)
          await citaNutricion(data)

    } catch (error) {
        
    }
    const data = {
        user: 1,
        fecha: req.body.fecha,
        hora: req.body.hora,
        descripcion: req.body.descripcion
      };
    res.render('cita-nutricion.ejs', {fecha : data.fecha, hora: data.hora}); 
})

router.post('/citaFisio', async (req, res)=>{
    try {
        const data = {
            user: 1,
            fecha: req.body.fecha,
            hora: req.body.hora,
            descripcion: req.body.descripcion
          };
          await citaFisio(data) 
         
    } catch (error) {
        
    }
    const data = {
        user: 1,
        fecha: req.body.fecha,
        hora: req.body.hora,
        descripcion: req.body.descripcion
      };
    res.render('cita-fisioterapia.ejs', {fecha : data.fecha, hora: data.hora}); 
})

router.post('rutina-3-bajar-peso', async(req, res,)=>{
    try {
        const data ={
            user:1111,
            rutina: "3DBP"
        }
        await agregarRutina(data)
    } catch (error) {
        
    }


})

export default router;