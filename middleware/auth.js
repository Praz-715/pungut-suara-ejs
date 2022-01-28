import UserModel from "../models/UserModel.js";

export const auth = async (req, res, next) => {
  if (req.session.auth) {
    const user = await UserModel.findOne({ email: req.session.email });
    req.session.user = {
      id: user._id,
      email: user.email,
      nama: user.nama,
      foto: user.foto,
      nohp: user.nohp,
      password: user.password,
      sidebar: user.sidebar,
    };

    next();
  } else {
    res.redirect("/auth");
  }
};
