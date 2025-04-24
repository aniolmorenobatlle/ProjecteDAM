const userModel = require('../models/userModel');

const verifyUserAdmin = async (req, res, next) => {
  const { username } = req.body;

  try {
    const userAdmin = await userModel.findUserAdmin(username);

    if (!userAdmin) {
      return res.status(401).json({ message: 'Usuari no trobat o no autoritzat' });
    }

    req.userAdmin = userAdmin;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en la verificació de l\'usuari' });
  }
};

module.exports = {
  verifyUserAdmin,
};
