import express from "express";
import UserModel from "../models/UserModel.js";



const router = express.Router()

router.get('/tambah-pemilihan',(req,res)=>{

  res.render('dashboard/tambah-pemilihan', { layout: 'layouts/main-layout', user:req.session.user });
})

router.get('/profile',(req,res)=>{

  res.render('dashboard/profile', { layout: 'layouts/main-layout', user:req.session.user });
})


router.post('/update-profile',(req,res)=>{
  const {nama, email, nohp} = req.body;
  console.log(nama, email, nohp)
  res.json({nama, email, nohp})
})



router.get('/', (req, res) => {
  // console.log(req.session.user)
  res.render('dashboard/dashboard', { layout: 'layouts/main-layout', user:req.session.user });
})


export default router