const adminMiddleware = (req, res, next) => {
  // Comprovar si l'usuari té el camp isAdmin a true
  if (req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Accés denegat. Usuari no és administrador' });
  }

  next(); // Permet l'accés a la ruta si l'usuari és administrador
};

module.exports = adminMiddleware;
