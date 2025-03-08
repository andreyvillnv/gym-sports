// import {nodemailer} from 'nodemailer'
// //import pkg from 'jsonwebtoken';
// //import {jwt} from 'jsonwebtoken'
// import dotenv from "dotenv";
// import pkg from 'jsonwebtoken';
// const {jwt} = pkg;
// dotenv.config();

//const {jwt} = pkg;

// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config({ path: "./src/.env" });

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
  
// export  async function enviarCorreoVerificacion(email) {


//     try {
//         console.log('correo user', email)
//         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
//         const urlVerificacion = `http://localhost:3000/verificar/${token}`;
//         console.log('correo .env', process.env.EMAIL_USER)
//         const opcionesCorreo = {
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: "Verifica tu cuenta",
//           html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
//                  <a href="${urlVerificacion}">${urlVerificacion}</a>`,
//         };

//         transporter.verify((error, success) => {
//             if (error) {
//               console.error("🚨 Error al conectar con el correo:", error);
//             } else {
//               console.log("✅ Servidor de correo listo para enviar mensajes");
//             }
//         })
//         transporter.sendMail(opcionesCorreo, (error, info)=>{
//             console.log('info', info)
//             if(error){
//                 console.log("error en enciar correo ", error);
//             }
//             console.log("Correo enviado correctamente", info);
//         });
      
//     } catch (error) {
//         console.log('Error en  enviarCorreoVerificacion', error)
//         throw error;
//     }

//   }


// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// // Cargar variables de entorno
// dotenv.config({ path: "./src/.env" });

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Función para enviar correo de verificación
// export async function enviarCorreoVerificacion(email) {
//     try {
//         console.log('Iniciando el envío de correo para el usuario:', email);

//         // Crear token JWT con el email
//         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
//         const urlVerificacion = `http://localhost:3000/verificar/${token}`;

//         console.log("Token generado:", token);
//         console.log("URL de verificación:", urlVerificacion);

//         // Opciones del correo a enviar
//         const opcionesCorreo = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Verifica tu cuenta",
//             html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
//                    <a href="${urlVerificacion}">${urlVerificacion}</a>`,
//         };

//         // Verificar que el transportador está funcionando
//         console.log("Verificando conexión con el servidor de correo...");
//         transporter.verify((error, success) => {
//             if (error) {
//                 console.error("🚨 Error al conectar con el servidor de correo:", error);
//             } else {
//                 console.log("✅ Servidor de correo listo para enviar mensajes");
//             }
//         });

//         // Enviar el correo
//         console.log('Enviando correo con opciones:', opcionesCorreo);
//         transporter.sendMail(opcionesCorreo, (error, info) => {
//             if (error) {
//                 console.log("🚨 Error al enviar correo:", error);
//             } else {
//                 console.log("✅ Correo enviado correctamente:", info);
//             }
//         });

//     } catch (error) {
//         console.log("⚠️ Error en la función enviarCorreoVerificacion:", error);
//         throw error;  // Lanzamos el error para que sea capturado en el controlador de rutas si es necesario
//     }
// }

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
//import dotenv from "dotenv";

//dotenv.config({ path: "./src/.env" });

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function enviarCorreoVerificacion(email) {
    try {
        console.log('Correo del usuario:', email);

        // Verifica que las variables de entorno estén configuradas
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.JWT_SECRET) {
            throw new Error("Faltan variables de entorno necesarias.");
        }

        // Genera el token JWT
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Construye la URL de verificación
        const urlVerificacion = `http://localhost:3000/verificar/${token}`;
        console.log('URL de verificación:', urlVerificacion);

        // Configura las opciones del correo
        const opcionesCorreo = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verifica tu cuenta",
            html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
                   <a href="${urlVerificacion}">${urlVerificacion}</a>`,
        };

        // Verifica la conexión con el servidor de correo
        transporter.verify((error, success) => {
            if (error) {
                console.error("🚨 Error al conectar con el servidor de correo:", error);
                throw error; // Lanza el error para que sea capturado en el catch
            } else {
                console.log("✅ Servidor de correo listo para enviar mensajes");
            }
            console.log('trasnporter',error, success) 
        });

        // Envía el correo
        const info = await transporter.sendMail(opcionesCorreo);
        console.log("Correo enviado correctamente:", info);

    } catch (error) {
        console.error('Error en enviarCorreoVerificacion:', error);
        throw error; // Relanza el error para que pueda ser manejado por el llamador
    }
}