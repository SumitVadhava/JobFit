const signup = (req, res, next) => {
  const { userName, email, password, role } = req.body;

  if (!userName || !email || !password || !role) {
    return res.status(400).json({
      message: "Missing required fields: name or email or password or role",
    });
  }

  next();
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Missing required fields: email or password",
    });
  }

  next();
};

const googleLogin = (req, res, next) => {
  const { name, email, picture, google_id } = req.body;

  if (!name || !email || !picture || !google_id) {
    return res.status(400).json({
      message:
        "Missing required fields: name or email or picture, or google_id",
    });
  }

  next();
};

module.exports = { login, signup, googleLogin };
