const verifyUserAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Accés només per administradors' });
  }

  next();
};

module.exports = verifyUserAdmin;

