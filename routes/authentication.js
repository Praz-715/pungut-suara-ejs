import express from "express";
import bcrypt from 'bcrypt';
import UserModel from "../models/UserModel.js";


const router = express.Router()

router.delete('/logout', (req, res)=>{
  // delete req.session
  req.session.destroy((err)=>{
      if(err) throw err;
    res.redirect('/auth')
    
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email })
  console.log('apakah tidak user',!user)
  if (!user) {
    console.log('didalem user')
    req.flash('pesan', 'Email tidak ditemukan');
    return res.redirect("/auth")
  }

  const cekPassword = await bcrypt.compare(password, user.password)
  if (!cekPassword) {
    req.flash('pesan', 'Password anda salah');
    return res.render('auth', { layout: 'layouts/login-regis-loyout', pesan: req.flash('pesan'), isiForm: req.body })
  }

  req.session.auth = true;
  req.session.email = user.email
  res.redirect('/dashboard');




})

router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  console.log(nama, email, password);

  let user = await UserModel.findOne({ email })

  if (user) {
    req.flash('pesan', 'Email sudah terdaftar, silahkan login');
    return res.render('auth', { layout: 'layouts/login-regis-loyout', pesan: req.flash('pesan'), isiForm: req.body })
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt)

  user = new UserModel({
    nama, email, password: passwordHash
  })

  await user.save()

  req.session.auth = true;
  req.session.email = user.email

  res.redirect('/dashboard')

})

router.get('/', (req, res) => {
  if(req.session.auth) res.redirect('/dashboard')
  res.render('auth', { layout: 'layouts/login-regis-loyout', pesan: req.flash('pesan') })
})

export default router