import { abrirConexion } from "../src/config-sql.js";

export async function citaNutricion(data) {
    try {
        const fechaHora = `${data.fecha} ${data.hora}`
        const connect = await abrirConexion()
        await connect.query(`insert into nutricion (idcliente, fecha, descripcion) values(${data.user}, '${fechaHora}', '${data.descripcion}')`)
        connect.end()
    } catch (error) {
        console.log('Error en citaNutricion', error)
    }
    
}

export async function agregarRutina(data) {
    try {
        const connect = await abrirConexion()
        await connect.query(`update cliente set idrutina = ${data.rutina} where idcliente = ${data.user}`)
        connect.end()
    } catch (error) {
        console.log('Error en agregarRutina', error)
    } 
}

export async function perfil(data) {
    try {
        console.log(data)
        const connect = await abrirConexion();

        const [rows] = await connect.query(
            "SELECT idcliente FROM cliente WHERE correo = ? AND pass = ?",
            [data.user, data.pass] // Evita inyección SQL
        );
        
        await connect.end();
        
        // Si rows está vacío, significa que no hay coincidencias
        if (rows.length === 0) {
            return null; // O un mensaje de error
        }
        
        return rows; 

    } catch (error) {
        onsole.error('Error en la perfil:', error);
    }
    
}

export async function dataPerfil(id) {
        try {
            const connect = await abrirConexion()
            const [rows] = await connect.query('select nombre, apellidos, correo, fechaNac, peso, altura, celular, genero  from cliente where idcliente = ?', [id])
            await connect.end();
            return rows[0] || null;

        } catch (error) {
            console.error('Error en la dataPerfil:', error);
            throw error;
        }
 
}

export async function citaFisio(data) {
    try {
        const fechaHora = `${data.fecha} ${data.hora}`
       // console.log(data)
        const connect = await abrirConexion()
        await connect.query(`insert into fisioterapia (idcliente, fecha, descripcion) values(${data.user}, '${fechaHora}', '${data.descripcion}')`)
        connect.end()
    } catch (error) {
        console.log('Error en citaFisio ', error)
    }
    
}

export async function citaPerfilNutricion() {
    try {
        const data = {
            id: 11111
        }
        const connect = await abrirConexion()
        
        const [rows] = await connect.query(
            "SELECT  fecha FROM nutricion WHERE idcliente = ? ",
            [data.id] // Evita inyección SQL
        );
        return rows; 
    } catch (error) {
        console.log('Error en citaPerfilNutricion', error)
    }
    
}

export async function cambioCitaNutricion(data) {
    try {
        const idcliente = 11111
        const fechaHora = `${data.fecha} ${data.hora}`
        const connect = await abrirConexion()
        const sql = `update nutricion set fecha = COALESCE(?, fecha), descripcion = COALESCE(?, descripcion)  WHERE idcliente = ?;`
        const values = [ fechaHora, data.descripcion,idcliente ]
        const [result] = await connect.execute(sql, values);
        if (result.affectedRows > 0) {
            console.log('Cambiado')
           return true
        } else {
           return false
        }
    } catch (error) {
        console.log('Error en cambioCitaNutricion', error)
        
    }
}

export async function nuevoRegistro(data) {
    try {
        const connect = await abrirConexion()
        await connect.query('insert into cliente (nombre, apellidos, correo, pass, fechaNac, peso, altura, celular, genero ) values(?,?,?,?,?,?,?,?,?)', [data.nombre, data.apellidos, data.correo, data.pass, data.fechaNac, data.peso, data.altura, data.celular, data.genero ])

        connect.end()
        
        return true
    } catch (error) {
        console.log('Error en nuevoRegistro', error)
        if (error.code === 'ER_DUP_ENTRY') {
            return false
        }

       
    }
    
}

export async function idUsuario(correo) {

    try {
        console.log(correo);
        const connect = await abrirConexion()
        const [rows] = await connect.query('select idcliente from cliente where correo = ?', [correo])
        await connect.end();
        //console.log('id= ',rows[0])
        return rows[0] || null;

    } catch (error) {
        console.log("Error en idUsuario", error)
    }
    
}

export async function credencilales(correo) {

    try {
        const connect = await abrirConexion()
        const [rows]  = await connect.query('select pass from cliente where correo = ?', [correo])
        await connect.end();
       // console.log('id= ',rows[0])
        return rows[0] || null;
    } catch (error) {
        console.log('Error en la credencilales ', error)
    }
    
}

export async function bloqueoCuenta(correo) {
    try {
        //console.log(correo)
        const connect = await abrirConexion()
        const [cliente] = await connect.query('SELECT bloqueo, intentos FROM cliente WHERE correo = ?', [correo]);
        await connect.end();
        return cliente
        
    } catch (error) {
        console.log('Error bloqueo cuenta', error)
        
    }

}

export async function intentos(correo) {
    try {
        const connect = await abrirConexion()
        await connect.query('UPDATE cliente SET intentos = 0, bloqueo = NULL WHERE correo = ?', [correo]);
        await connect.end();
    } catch (error) {
        console.log('Error en intentos ', error)
        
    }
}

export async function agregarIntentos(dataIntentos) {
    try {
        console.log(dataIntentos)
        const connect = await abrirConexion()
        await connect.query('UPDATE cliente SET intentos = ?, bloqueo = ? WHERE correo = ?', [dataIntentos.intentos, dataIntentos.bloqueo, dataIntentos.correo]);
        await connect.end();
    } catch (error) {
        console.log("Error en agregarIntentos", error)
        
    }
    
}
