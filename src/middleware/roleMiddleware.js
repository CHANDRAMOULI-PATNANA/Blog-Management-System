exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
  
  exports.isEditor = (req, res, next) => {
    if (req.userRole !== 'Editor') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };