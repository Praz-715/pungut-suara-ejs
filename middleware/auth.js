import UserModel from "../models/UserModel.js";
import PemiluModel from "../models/PemiluModel.js";

export const auth = async (req, res, next) => {
  if (req.session.auth) {
    const user = await UserModel.findOne({ email: req.session.email });
    const pemilihan = await PemiluModel.find({pemilik: user._id},'namaPemilihan slug')
    req.session.user = user;
    req.session.pemilihan = pemilihan;

    next();
  } else {
    res.redirect("/auth");
  }
};
