import express from "express";
import UserModel from "../models/UserModel.js";



const router = express.Router()

router.get('/tambah-pemilihan',(req,res)=>{

  res.render('dashboard/tambah-pemilihan', { layout: 'layouts/main-layout', user:req.session.user });
})


router.get('/', (req, res) => {
  // console.log(req.session.user)
  res.render('dashboard/dashboard', { layout: 'layouts/main-layout', user:req.session.user });
})


export default router