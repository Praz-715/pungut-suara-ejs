import express from "express";
import PemiluModel from "../models/PemiluModel.js"
import moment from "moment";


const router = express.Router()

router.get('/pemilihan', (req, res) => {
  console.log('ini di pemilihan')
  res.render('landing-page/pemilihan', { layout: 'layouts/landing-layout' })
})

// router.get('/:slug/:grup', (req,res)=>{
//   console.log('ini di slug grup')
//   res.render('landing-page/pemilihan', {layout: 'layouts/landing-layout'})
// })

router.get('/:slug', async (req, res, next) => {
  const slug = req.params.slug
  const pemilihan = await PemiluModel.findOne({ slug })

  if (pemilihan) {
    // console.log(pemilihan)
    const waktuAwal = moment(pemilihan.waktuPelaksanaan.awal)
    const waktuAkhir = moment(pemilihan.waktuPelaksanaan.akhir)
    const waktuSekarang = moment()

    if (waktuAwal.diff(waktuSekarang) <= 0) {
      if (waktuAkhir.diff(waktuSekarang) <= 0) {
        console.log('akan berakhir', waktuAkhir.diff(waktuSekarang))
        pemilihan.statusPemilihan = 'telah berakhir'
      } else {
        console.log('sedang berlangsung', waktuAkhir.diff(waktuSekarang))
        pemilihan.statusPemilihan = 'sedang berlangsung'
      }
    } else {
      console.log('akan berlangsung', waktuAwal.diff(waktuSekarang))
      pemilihan.statusPemilihan = 'akan berlangsung'
    }
    pemilihan.save()

    console.log(pemilihan.statusPemilihan)
    res.render('landing-page/pemilihan', { layout: 'layouts/pemilihan-layout', pemilihan })

  }
  else {
    next()
  }



  // console.log('ini di slug')
})


router.get('/haha', (req, res) => {
  res.render('landing-page/index', { layout: 'layouts/landing-layout',user: req.session.user })
})
router.get('/', (req, res) => {
  res.render('landing-page/index2', { layout: 'layouts/landing-layout2',user: req.session.user })
})

export default router