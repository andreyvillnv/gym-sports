

export function verificarAutenticacion(req, res, next) {
    console.log(req.session.usuario)
    if (req.session.usuario) {
        // Usuario autenticado, permitir acceso
        return next();
    }
    //  Usuario no autenticado, redirigir al login
    res.redirect('/');
}


export function checkLoginAttempts(req, res, next) {
    const maxAttempts = 3; // Número máximo de intentos permitidos
    const blockTime = 60 * 60 * 1000; // Tiempo de bloqueo en milisegundos (1 hora)

    // Inicializar el contador de intentos fallidos y el tiempo de bloqueo
    if (!req.session.loginAttempts) {
        req.session.loginAttempts = 0;
    }
    if (!req.session.blockTime) {
        req.session.blockTime = 0;
    }

    // Verificar si el usuario está bloqueado
    if (req.session.blockTime > Date.now()) {
        const remainingTime = Math.ceil((req.session.blockTime - Date.now()) / 1000 / 60); // Tiempo restante en minutos
        return `Cuenta bloqueada. Intenta nuevamente en ${remainingTime} minutos.`;
    }

    // Si no está bloqueado, continuar
    next();
}