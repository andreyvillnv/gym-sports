// import fs from 'fs'; 
// import path from 'path';     
// import { idUsuario } from "./querys-sql.js";  

// export async function usuarioID(correo) { 
//           const dir_name = dirname(fileURLToPath(import.meta.url))
//           const usuario = await idUsuario(correo);
//           console.log('usuario', usuario)
//           if (!usuario || usuario.length === 0) {
//               throw new Error('No se pudo obtener el ID del usuario');
//           }
  
//           const idUsuarioRegistrado = usuario[0].id; // Extraer el ID
  
//           // Crear un objeto con el ID del usuario
//           const usuarioJSON = {
//               id: idUsuarioRegistrado,
//               correo: data.correo,
//               nombre: data.nombre,
//               apellidos: data.apellidos
//           };
//           console.log('json', usuarioJSON)
//           // Guardar el objeto en un archivo JSON en la carpeta public
//           const rutaArchivo = join(__dirname, 'public', 'usuario.json');
//           //const rutaArchivo = join(__dirname, '../public/usuario.json');
//           fs.writeFileSync(rutaArchivo, JSON.stringify(usuarioJSON, null, 2));

// }





// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url'; // Importar fileURLToPath
// import { idUsuario } from "./querys-sql.js";

// export async function usuarioID(correo) {
//     // Obtener la ruta del directorio actual
//     const __dirname = path.dirname(fileURLToPath(import.meta.url));

//     // Obtener el ID del usuario
//     const usuario = await idUsuario(correo);
//     console.log('usuario', usuario);

//     if (!usuario || usuario.length === 0) {
//         throw new Error('No se pudo obtener el ID del usuario');
//     }

//     const idUsuarioRegistrado = usuario[0].idcliente; // Extraer el ID

//     // Crear un objeto con el ID del usuario
//     const usuarioJSON = {
//         id: idUsuarioRegistrado,
//         correo: correo, // Usar el correo proporcionado
//         nombre: usuario[0].nombre, // Asumiendo que el nombre está en el resultado
//         apellidos: usuario[0].apellidos // Asumiendo que los apellidos están en el resultado
//     };
//     console.log('json', usuarioJSON);

//     // Guardar el objeto en un archivo JSON en la carpeta public
//     const rutaArchivo = path.join(__dirname, '../public/usuario.json'); // Ruta correcta
//     fs.writeFileSync(rutaArchivo, JSON.stringify(usuarioJSON, null, 2));
//     console.log('Archivo JSON guardado en:', rutaArchivo);
// }

import fs from 'fs';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { idUsuario } from "./querys-sql.js";

const dir_name = dirname(fileURLToPath(import.meta.url));

export async function usuarioID(correo) {
    try {
        const usuario = await idUsuario(correo);
        //console.log('Usuario obtenido:', usuario.idcliente);

        if (!usuario || usuario.length === 0) {
            throw new Error('No se pudo obtener el ID del usuario');
        }

        const idUsuarioRegistrado = usuario.idcliente;

        const usuarioJSON = {
            id: idUsuarioRegistrado,
 
        };

        //console.log('JSON a guardar:', usuarioJSON);

        // Asegurar que la carpeta public exista
        const carpetaPublic = join(dir_name, 'public');
        if (!fs.existsSync(carpetaPublic)) {
            fs.mkdirSync(carpetaPublic, { recursive: true });
        }

        const rutaArchivo = join(carpetaPublic, 'usuario.json');
        fs.writeFileSync(rutaArchivo, JSON.stringify(usuarioJSON, null, 2));
        
        //console.log('Archivo JSON guardado en:', rutaArchivo);
    } catch (error) {
        console.error('Error en usuarioID:', error);
    }
}

export function leerUsuarioID(){
    try {
        const carpetaPublic = join(dir_name, 'public');
        const rutaArchivo = join(carpetaPublic, 'usuario.json');
    } catch (error) {
        
    }
}