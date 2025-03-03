import { query, Router } from "express";
import session from 'express-session';
import {cifrar, descifrar} from '../cifrado.js'
import { citaNutricion,idUsuario, agregarRutina, perfil, dataPerfil, citaFisio, citaPerfilNutricion, cambioCitaNutricion, nuevoRegistro, credencilales, intentos, agregarIntentos, bloqueoCuenta} from "../querys-sql.js";
import { usuarioID } from "../id-usuario.js";
import { verificarAutenticacion } from "../authMiddleware.js";
const router = Router();


router.get("/", (req, res) =>res.render("login.ejs", { error: "" }))  


router.get('/nutricion', verificarAutenticacion, (req, res) => {

    res.render('nutricion.ejs', { usuario: req.session.usuario }); 
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
         const validarcorreo = await nuevoRegistro(data);
         if (validarcorreo){
            await usuarioID(data.correo); 
            res.render('index.ejs')
         } else if (!validarcorreo){
            res.render('registro.ejs', { error: "El correo ya está en uso" });
         }
          
          
         
    } catch (error) {
        
    }
  
    
});

router.post('/login', async (req, res) => {
    
    try {
        const data = {
            correo: req.body.correo,
            pass: req.body.pass
        }
        if(data.correo==='' || data.pass==='' ){
            res.render('login.ejs', { error:'Los campos no pueden estar vacios.'}) 
            return
        }
        const cliente = await bloqueoCuenta(data.correo)
        console.log(cliente)

        if (cliente[0].bloqueo && new Date(cliente[0].bloqueo) > new Date()) {
            const tiempoRestante = Math.ceil((new Date(cliente[0].bloqueo) - new Date()) / 60000);
            console.log(`Cuenta bloqueada. Intenta nuevamente en ${tiempoRestante} minutos.`)
            res.render('login.ejs', { error:`Cuenta bloqueada. Intenta nuevamente en ${tiempoRestante} minutos.`})            
            return ;
        }
     

        const rows = await credencilales(data.correo)       
        const descifrado = await descifrar(data.pass, rows.pass)
       
        if (descifrado) {
            const id_usuario = await idUsuario(data.correo)
            console.log("id user= ",id_usuario)            
            await intentos(data.correo)
            req.session.usuario = id_usuario.idcliente
            res.render('index.ejs');  
            return            
        } else {
            //const intentos =0
            if(cliente[0].intentos >= 3){
                const nuevosIntentos = 0
            }else{
                const nuevosIntentos = cliente[0].intentos + 1;
            }
            

            let bloqueoTiempo = null;
            if (nuevosIntentos >= 3) {
                bloqueoTiempo = new Date(Date.now() + 60 * 60 * 1000); // Bloqueo por 1 hora
              
            }

            const dataIntentos = {
                intentos: nuevosIntentos,
                bloqueo: bloqueoTiempo,
                correo : data.correo
            }  

            await agregarIntentos(dataIntentos)

            if (nuevosIntentos >= 3) {
                 res.render('login.ejs', { error: 'Has superado el límite de intentos. Intenta nuevamente en 1 hora.'});
            }
            res.render('login.ejs', { error: "Correo o contraseña incorrectos" });
        }
    } catch (error) {
        console.log(error)
        res.render('login.ejs', { error: "El correo no existe" });
    }    
});

router.get('/registro', async (req, res) => {
    res.render("registro.ejs", { error: "" })
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
router.get('/fisioterapia',verificarAutenticacion,  (req, res) => {
    res.render('fisioterapia.ejs', { usuario: req.session.usuario }); 
});
router.get('/matricula',verificarAutenticacion, (req, res) => {
    res.render('planes-matricula.ejs', { usuario: req.session.usuario }); 
});

// router.get('/perfil', async (req, res) => {
//     try {
//         const rows = await dataPerfil()
//         console.log(rows)
//         res.render('perfil.ejs', {nombre: rows[0].nombre +' '+ rows[0].apellidos, fecha: rows[0].fechaNac, estatura: rows[0].altura, peso : rows[0].peso }); 
//     } catch (error) {
        
//     }

   
// });

router.get('/perfil',verificarAutenticacion, async (req, res) => {
    try {
        const id = req.session.usuario
        const rows = await dataPerfil(id);  // Obtener datos del perfil
        const citasNutricion = await citaPerfilNutricion();  // Obtener citas de nutrición
        
        console.log(rows);
        console.log("fecha ",citasNutricion);

        // if (!rows.length) {
        //     return res.status(404).send("Perfil no encontrado");
        // }
        const fecha = citasNutricion[0].fecha.toISOString().split("T")[0];
        const fechaNac = rows.fechaNac.toISOString().split("T")[0];
        const hora = citasNutricion[0].fecha.toTimeString().split(" ")[0];
        const cita = fecha + ' a las ' + hora 
        // Si no hay citas de nutrición, asignar un valor vacío o mensaje
        const citaNutri = citasNutricion.length > 0 ? cita : "Sin cita asignada";
        
        res.render('perfil.ejs', {
            usuario: req.session.usuario,
            nombre: rows.nombre + ' ' + rows.apellidos,
            fecha: fechaNac,
            estatura: rows.altura,
            peso: rows.peso,
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