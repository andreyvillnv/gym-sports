import  bcrypt from "bcrypt"

export async function cifrar(text){
    const saltRounds = 10; // Número de rondas de cifrado
    const hashedtext = await bcrypt.hash(text, saltRounds);
    return hashedtext
}

export async function descifrar(text, cifrado) {
    try {
        const decipher = await bcrypt.compare(text, cifrado);
        return decipher 
    } catch (error) {
        console.log("error en decifrar", error)
        
    }
   
}