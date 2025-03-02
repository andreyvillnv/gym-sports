import {config} from "dotenv"
import mysql from 'mysql2/promise'

config()

 export async function abrirConexion() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin09',
      database: 'gym_sports',
    });
  
    console.log('Conexión exitosa a la base de datos');
    return connection;
  } catch (error) {
    console.log(error)
    
  }

}

