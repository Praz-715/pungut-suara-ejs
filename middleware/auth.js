import UserModel from "../models/UserModel.js";


export const auth = async (req, res, next) => {
  if (req.session.auth) {
    const user = await UserModel.findOne({ email: req.session.email })
    req.session.user = { id: user._id, nama: user.nama, foto: user.foto };
    next()
  } else {
    res.redirect('/auth')
  }
}