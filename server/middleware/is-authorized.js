function authorizationMiddleware(allowedRoles) {
  return function (req, res, next) {
    const role = req.userType;
    if (allowedRoles.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: "Insufficient permissions" });
    }
  };
}

module.exports = authorizationMiddleware;
