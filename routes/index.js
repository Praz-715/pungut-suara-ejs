import express from "express";
import bcrypt from 'bcrypt';
import UserModel from "../models/UserModel.js";

import { auth } from "../middleware/auth.js";


const router = express.Router()


router.get('/', auth, (req, res) => {
  res.render('home', { layout: 'layouts/main-layout' });
})


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

  if (!user) {
    req.flash('pesan', 'Email tidak ditemukan');
    res.redirect("/auth#signin")
  }

  const cekPassword = await bcrypt.compare(password, user.password)
  if (!cekPassword) {
    req.flash('pesan', 'Password anda salah');
    res.render('auth', { layout: 'layouts/login-regis-loyout', pesan: req.flash('pesan'), isiForm: req.body })
  }

  req.session.auth = true;
  res.redirect('/');




})

router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  console.log(nama, email, password);

  let user = await UserModel.findOne({ email })

  if (user) {
    req.flash('pesan', 'Email sudah terdaftar, silahkan login');
    res.render('auth', { layout: 'layouts/login-regis-loyout', pesan: req.flash('pesan'), isiForm: req.body })
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt)

  user = new UserModel({
    nama, email, password: passwordHash
  })

  await user.save()

  req.session.auth = true;

  res.redirect('/')

})

router.get('/auth', (req, res) => {
  res.render('auth', { layout: 'layouts/login-regis-loyout', pesan: req.flash('pesan') })
})

export default router