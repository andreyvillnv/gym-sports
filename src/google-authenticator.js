
// import { Router } from 'express';
// import {speakeasy} from 'speakeasy'


// const router = express();
// router.use(express.json());

// // Almacenamiento temporal (en un entorno real, usa una base de datos)
// let userSecret = null;

// // Ruta para generar el secreto
// router.post('/2fa/setup', (req, res) => {
//   const secret = speakeasy.generateSecret({ length: 20 });
//   userSecret = secret.base32; // Guardar el secreto
//   console.log(userSecret)
//   res.json({ secret: userSecret }); // Enviar el secreto al frontend
// });

// // Ruta para verificar el código 2FA
// router.post('/2fa/verify', (req, res) => {
//   const { token } = req.body;

//   // Verificar el código ingresado por el usuario
//   const verified = speakeasy.totp.verify({
//     secret: userSecret,
//     encoding: 'base32',
//     token: token,
//   });

//   if (verified) {
//     res.json({ message: '2FA verificado correctamente' });
//   } else {
//     res.status(400).json({ message: 'Código 2FA inválido' });
//   }
// });

// Iniciar el servidor
