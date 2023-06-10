import express from "express";
import PemiluModel from "../models/PemiluModel.js"
import moment from "moment";
import mongoose from 'mongoose'
import session from "express-session";

function cekWaktu(pemilihan) {
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
}


const router = express.Router()

router.get('/pemilihan', (req, res) => {
  console.log('ini di pemilihan')
  res.render('landing-page/pemilihan', { layout: 'layouts/landing-layout' })
})

// router.get('/:slug/:grup', (req,res)=>{
//   console.log('ini di slug grup')
//   res.render('landing-page/pemilihan', {layout: 'layouts/landing-layout'})
// })

router.get('/:slug/mulai-pemilihan', async (req, res, next) => {
  const slug = req.params.slug
  const pemilihan = await PemiluModel.findOne({ slug })
  const sesiPemilih = req.session.pemilih
  const queryParams = req.query
  console.log('tipe data sesiPemilih = ', sesiPemilih)
  console.log('queryParams = ', queryParams.length)
  // req.session.destroy()

  if (pemilihan) {
    cekWaktu(pemilihan)
    // sesiPemilih = []
    // console.log('pemilihan id', pemilihan._id, sesiPemilih.find(element => element.pemilihanId == String(121242355)) == undefined)
    if (sesiPemilih == null || sesiPemilih.find(element => element.pemilihanId == String(pemilihan._id)) == undefined) {
      return res.redirect(`/${slug}`)
    }

    if (pemilihan.statusPemilihan == 'sedang berlangsung' && sesiPemilih.find(element => element.pemilihanId == String(pemilihan._id))) {
      console.log("query params", queryParams, !pemilihan.fieldGroup.includes(queryParams))
      if(!pemilihan.fieldGroup.includes(queryParams) && queryParams.length > 0) return res.redirect(`/${slug}`)
      //
      res.render('landing-page/mulai-pemilihan', { layout: 'layouts/landing-layout', pemilihan, queryParams })

    } else {
      res.redirect(`/${slug}`)
    }
  }
  else {
    next()
  }
})
router.get('/:slug', async (req, res, next) => {
  const slug = req.params.slug
  const pemilihan = await PemiluModel.findOne({ slug })

  if (pemilihan) {
    cekWaktu(pemilihan)
    // console.log('apakah sesi null?', req.session.pemilih != null)
    if (req.session.pemilih != null) {
      console.log("Masuk sini ga?")
      const cekPemilihanId = req.session.pemilih.find(element => element.pemilihanId == String(pemilihan._id));
      if (cekPemilihanId && pemilihan.statusPemilihan == 'sedang berlangsung') {
        res.redirect(`/${slug}/mulai-pemilihan`)

      }

    }
    // res.render('landing-page/pemilihan', { layout: 'layouts/pemilihan-layout', pemilihan })
    res.render('landing-page/pemilihan2', { layout: 'layouts/landing-layout', pemilihan, tidakDitemukan: req.flash('tidakDitemukan') })
  }
  else {
    next()
  }
})

router.post('/:slug', async (req, res, next) => {
  const slug = req.params.slug
  const pemilihan = await PemiluModel.findOne({ slug })
  console.log('body request', req.body)

  function inputPemilihArray(calonPemilih) {
    if (req.session.pemilih != null) {
      req.session.pemilih.push(calonPemilih)
    } else {
      req.session.pemilih = [calonPemilih]
    }
  }

  if (pemilihan) {
    cekWaktu(pemilihan)
    if (pemilihan.statusPemilihan == 'sedang berlangsung') {
      let calonPemilih = {}

      // Pemilihan terbuka
      if (pemilihan.pemilihanTerbuka) {
        calonPemilih = { pemilihId: mongoose.Types.ObjectId(), identitas: req.body, pemilihanId: pemilihan._id }
        inputPemilihArray(calonPemilih)
        console.log('session',req.session)
        res.redirect(`/${slug}/mulai-pemilihan`)
      }
      // Pemilihan tertutup
      else {
        const inputBody = req.body
        const namaKey = pemilihan.fieldPemilih.find((o) => o.key == true).namaField
        const valueKey = inputBody[namaKey]
        const pemilihDitemukan = pemilihan.pemilih.find((o) => o.key == valueKey)

        // Jika pemilihan ditemukan
        if (pemilihDitemukan) {
          delete inputBody[namaKey]
          const identitas = inputBody
          calonPemilih = { pemilihanId: pemilihan._id, identitas, pemilihId: pemilihDitemukan._id }
          // Masukan calon pemilih kedalam session
          inputPemilihArray(calonPemilih)


        }
        // Jika pemilihan tidak ditemukan 
        else {
          // Kirim data tidak ditemukan
          req.flash('tidakDitemukan', { ...req.body, msg: `${namaKey} tidak ditemukan` })
          res.redirect(`/${slug}`)
        }
        res.redirect(`/${slug}/mulai-pemilihan`)
      }

    } else {
      res.redirect(`/${slug}`)
    }
  }
  else {
    next()
  }
})


router.get('/haha', (req, res) => {
  res.render('landing-page/index', { layout: 'layouts/landing-layout', user: req.session.user })
})
router.get('/', (req, res) => {
  res.render('landing-page/index', { layout: 'layouts/landing-layout', user: req.session.user })
})

export default router