import {registraEventos} from './querys-sql.js'

export async function eventos(data) {
    try {
        const fecha = new Date();
        console.log('fecha', fecha)
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes va de 0 a 11, por eso sumamos 1
        const dia = String(fecha.getDate()).padStart(2, '0');
        const hora = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        
       const fechaActual = `${año}-${mes}-${dia} ${hora}:${minutos}`;

       await registraEventos(data, fecha)

    } catch (error) {
        console.log('Error en eventos', error)
    }
    
}