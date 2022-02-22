import express from "express";
import { UploadImage } from "../middleware/UploadImage.js";
import UserModel from "../models/UserModel.js";
import PemiluModel from "../models/PemiluModel.js";
import bcrypt from "bcrypt";
import moment from "moment";
import FloraEditor from 'wysiwyg-editor-node-sdk'
import mongoose from "mongoose";

import formidable from "formidable";


const router = express.Router();

moment.locale('id')


function generateCalon(pemilihan) {
  let nantinya = ''
  if (pemilihan.modeGroup) {
    let inian = []
    for (let i = 0; i <= pemilihan.fieldGroup.length; i++) {
      if (i < pemilihan.fieldGroup.length) {
        const calonNya = pemilihan.calonDipilih.filter((e) => e.grup === pemilihan.fieldGroup[i])
        inian.push({ grup: pemilihan.fieldGroup[i], calon: calonNya })
      } else {
        const calonNya = pemilihan.calonDipilih.filter((e) => !pemilihan.fieldGroup.includes(e.grup))
        if (calonNya.length > 0) inian.push({ grup: 'Tidak Terdaftar', calon: calonNya })

      }
    }
    // console.log(inian[0].calon)



    inian.forEach((baris) => {
      nantinya += `<div class='row'><center><h4>Grup ${baris.grup}</h4></center>`

      if (baris.calon.length == 0) {
        if (baris.grup === 'Tidak Terdaftar') {

        } else {
          nantinya += `<center>Tidak ada Calon</center>`
        }
      } else {
        baris.calon.forEach((calon) => {
          nantinya += `<div class="col-md-3 col-xs-12 widget widget_tally_box">
          <div class="x_panel fixed_height_390">
              <div class="x_content gambar">
    
                  <div class="text-center">
    
                      <img src="/${calon.foto}" alt="${calon.nama}" id="fotoCalonNya" class="img-circle calon_img">
                  </div>
    
                
                  <!-- <h4 class="name">No. 1</h4> -->
                  <h4 class="name">${calon.nama}</h4>
                  <div class="flex">
                      <ul class="list-inline count2">
                          <li>
                              <h4>400</h4>
                              <span>Dilihat</span>
                          </li>
                          <li>
                              <h4>${calon.jumlahSuara}</h4>
                              <span>Suara</span>
                          </li>
                          <li>
                              <h4>10%</h4>
                              <span>Persen</span>
                          </li>
                      </ul>
                  </div>
                  <div class="text-center">
                  <p>Grup ${calon.grup}</p>
                      <button type="button" class="btn btn-primary" onclick="showModalCalon('${calon._id}')">
                          Buat Deskripsi
                      </button>
                  </div>
              </div>
          </div>
      </div>
      `
        })
      }
      nantinya += `</div>`
    })
  } else {
    pemilihan.calonDipilih.forEach((calon) => {
      nantinya += `<div class="col-md-3 col-xs-12 widget widget_tally_box">
      <div class="x_panel fixed_height_390">
          <div class="x_content gambar">

              <div class="text-center">

                  <img src="/${calon.foto}" alt="${calon.nama}" id="fotoCalonNya" class="img-circle calon_img">
              </div>

            
              <!-- <h4 class="name">No. 1</h4> -->
              <h4 class="name">${calon.nama}</h4>
              <div class="flex">
                  <ul class="list-inline count2">
                      <li>
                          <h4>400</h4>
                          <span>Dilihat</span>
                      </li>
                      <li>
                          <h4>${calon.jumlahSuara}</h4>
                          <span>Suara</span>
                      </li>
                      <li>
                          <h4>10%</h4>
                          <span>Persen</span>
                      </li>
                  </ul>
              </div>
              <div class="text-center">
              <!-- <p>Grup ${calon.grup}</p> -->
                  <button type="button" class="btn btn-primary" onclick="showModalCalon('${calon._id}')">
                      Buat Deskripsi
                  </button>
              </div>
          </div>
      </div>
  </div>
  `
    })
  }
  return nantinya



}




// POST

router.post('/tambah-key', async (req, res) => {
  const { denganCara, slug, data, banyakToken } = req.body
  const pemilu = await PemiluModel.findOne({ slug })
  const kunciMasuk = pemilu.fieldPemilih.filter(e => e.key)[0]
  const pemilihYangSudahTerdaftar = pemilu.pemilih.map(e => e.key)

  console.log('pemilih yg sudah terdaftar: ', pemilihYangSudahTerdaftar)
  let datanya
  if (denganCara == 'buatToken') {

  } else if (denganCara == 'buatManual') {

  } else if (denganCara == 'buatImportExcel') {
    datanya = JSON.parse(data)
    const ambilDuplikat = datanya.filter((s => v => s.has(v) || !s.add(v))(new Set))
    if (ambilDuplikat.length > 0) {
      datanya = [... new Set(datanya)]
      res.json(`Terdapat data duplikat ${datanya.length} ditambahkan`)
    }


    // hapus isi pemilih
    // await PemiluModel.findOneAndUpdate({ slug }, { $set: { pemilih: [] } })



    // datanya.forEach((kambing, index)=>{
    //   pemilu.pemilih.push({_id: mongoose.mongo.ObjectId(), key: kambing})
    // })
    // pemilu.save()



    res.json(`${datanya.length} ditambahkan`)
    // console.log(datanya.length)




  } else {
    res.status(503).json({ msg: "kambing" })
  }
  res.json(`Data duplikat ---- ${datanya.length}`)
})

router.post('/tambah-field-pemilih', async (req, res) => {
  const { slug, namaField, tipeField, harusDiisi, dataField } = req.body
  // res.json(req.body)

  let fieldBaru = { namaField, tipeField }
  if (harusDiisi) fieldBaru.harusDiisi = harusDiisi
  if (dataField.length > 1) fieldBaru.dataField = dataField.split(";")

  const pemilihan = await PemiluModel.findOne({ slug })
  console.log(pemilihan)

  pemilihan.fieldPemilih.push(fieldBaru)
  pemilihan.save()
  res.redirect(`/dashboard/pemilihan/${slug}/pemilih`)
})

router.post('/tambah-calon', UploadImage, async (req, res) => {
  console.log('didalam calon')
  if (!req.file) res.status(500)

  const { namaCalon, grupCalon, slug } = req.body
  const fotoPath = req.file.path
  const calonBaru = { nama: namaCalon, foto: fotoPath }

  if (grupCalon) {
    calonBaru.grup = grupCalon
  }

  let pemilihan = await PemiluModel.findOne({ slug })

  pemilihan.calonDipilih.push(calonBaru)
  pemilihan.save()

  res.send(generateCalon(pemilihan))
})

router.post("/tambah-pemilihan", async (req, res) => {
  const { namaPemilihan, sifatPemilihan, waktuBerlangsung } = req.body;

  const waktunya = waktuBerlangsung.split(' - ');
  console.log(waktunya)
  const waktuAwal = new Date(waktunya[0])
  const waktuAkhir = new Date(waktunya[1])
  const waktuSekarang = new Date()

  // console.log('waktu awal', waktuAwal.toLocaleString('id-ID'))
  // console.log('waktu akhir', waktuAkhir.toLocaleString('id-ID'))

  let statusPemilihan

  if (waktuAwal - waktuSekarang < 0) {
    if (waktuAkhir - waktuSekarang < 0) {
      statusPemilihan = 'telah berakhir'
    } else {
      statusPemilihan = 'sedang berlangsung'
    }
  } else {
    statusPemilihan = 'akan berlanngsung'
  }

  const pemilihan = {
    pemilik: req.session.user._id,
    namaPemilihan: namaPemilihan,
    pemilihanTerbuka: (sifatPemilihan === 'terbuka' || false),
    waktuPelaksanaan: {
      awal: waktuAwal,
      akhir: waktuAkhir
    },
    statusPemilihan
  }

  if (!pemilihan.pemilihanTerbuka) {
    pemilihan.fieldPemilih = [{ namaField: "Kunci Masuk", tipeField: "text", key: true, harusDiisi: true }]
  }

  const response = await PemiluModel(pemilihan).save()

  // const response = {slug:'heheh'}

  res.redirect(`/dashboard/pemilihan/${response.slug}`)



  // PemiluModel.insertMany({
  //   pemilik       : req.session.user._id,
  //   namaPemilihan : namaPemilihan,
  //   pemilihanTerbuka: (sifatPemilihan === 'terbuka' || false)
  // })


  // res.send("ok");
});


router.post('/upload_image', function (req, res) {

  // Store image.
  FloraEditor.Image.upload(req, '/public/production/images/', function (err, data) {

    // Return data.
    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data)
  });


});




// PUT

router.put('/edit-field-pemilih', async (req, res) => {
  const { slug, namaFieldEdit, tipefieldEdit, harusDiisiEdit, dataFieldEdit, idField } = req.body
  // res.json(req.body)

  let fieldEdit = { 'fieldPemilih.$.namaField': namaFieldEdit, 'fieldPemilih.$.tipeField': tipefieldEdit }
  harusDiisiEdit ? fieldEdit['fieldPemilih.$.harusDiisi'] = harusDiisiEdit.length > 0 : fieldEdit['fieldPemilih.$.harusDiisi'] = false
  if (dataFieldEdit.length > 1) fieldEdit['fieldPemilih.$.dataField'] = dataFieldEdit.split(";")
  console.log(fieldEdit)
  const pemilihan = await PemiluModel.findOneAndUpdate({ slug, 'fieldPemilih._id': idField }, { $set: fieldEdit })
  // console.log('pemilihannya',pemilihan)

  res.redirect(`/dashboard/pemilihan/${slug}/pemilih`)
})

router.put('/change-group-field', async (req, res) => {
  const { grup, slug } = req.body
  // const  = { nama: "Teguh", foto: "bambang" }
  let pemilihan = await PemiluModel.findOne({ slug })
  console.log('grupnya  ', grup)

  const fieldGroup = (grup) ? grup : []

  pemilihan.fieldGroup = fieldGroup
  pemilihan.save()


  res.send(generateCalon(pemilihan))
})


router.put('/edit-calon', UploadImage, async (req, res) => {

  console.log('diedit calon')
  const { slug, idCalonEdit, namaCalonEdit, grupCalonEdit, deskripsiCalonEdit, tidakada } = req.body


  let calonUpdate = {
    'calonDipilih.$.nama': namaCalonEdit,
    'calonDipilih.$.deskripsi': deskripsiCalonEdit,
  }


  // jika ada foto
  if (req.file) {
    calonUpdate['calonDipilih.$.foto'] = req.file.path
  }
  // jika ada grup
  if (grupCalonEdit) {
    calonUpdate['calonDipilih.$.grup'] = grupCalonEdit
  }


  let pemilihan = await PemiluModel.findOneAndUpdate(
    { slug, 'calonDipilih._id': idCalonEdit },
    { $set: calonUpdate }
  )

  setTimeout(async () => {
    pemilihan = await PemiluModel.findOne({ slug })
    res.send(generateCalon(pemilihan))
  }, 250)


})







router.put('/edit-pemilihan', (req, res) => {
  let { id, namaPemilihan, sifatPemilihan, waktuBerlangsung, modeGrup, perhitunganLive, deskripsi } = req.body


  const waktunya = waktuBerlangsung.split(' - ');
  console.log(waktunya)
  const waktuAwal = new Date(waktunya[0])
  const waktuAkhir = new Date(waktunya[1])


  PemiluModel.findById(id, (err, data) => {
    console.log("ini diedti woe")
    if (err) throw err
    data.namaPemilihan = namaPemilihan;
    data.pemilihanTerbuka = (sifatPemilihan === 'terbuka') ? true : false;
    data.modeGroup = (modeGrup === 'ya') ? true : false;
    data.perhitunganLive = (perhitunganLive === 'ya') ? true : false;
    data.waktuPelaksanaan = { awal: waktuAwal, akhir: waktuAkhir }

    console.log("dalam edit, apakah true", typeof data.fieldPemilih != 'undefined' &&
      data.fieldPemilih.length > 0 &&
      !data.pemilihanTerbuka)
    if (typeof data.fieldPemilih != 'undefined' &&
      data.fieldPemilih.length > 0 &&
      !data.pemilihanTerbuka) {

      console.log("cari filter == true", data.fieldPemilih.filter(e => e.key == true).length)
      if (data.fieldPemilih.filter(e => e.key === true).length) {
        console.log('ini ada')
      } else {
        console.log('ini kosong')
        data.fieldPemilih.push({
          $each: [{ namaField: "Kunci Masuk", tipeField: "text", key: true, harusDiisi: true }],
          $position: 0
        }

        )

      }
    } else {
      if (data.fieldPemilih.length == 0 && !data.pemilihanTerbuka) {
        data.fieldPemilih.push({ namaField: "Kunci Masuk", tipeField: "text", key: true, harusDiisi: true })
      }
    }
    // pemilihan.waktuPelaksanaan.akhir = waktuAkhir
    data.deskripsi = deskripsi
    data.save()

  })

  setTimeout(() => {
    PemiluModel.findById(id, (err, data) => {
      if (err) throw err
      res.redirect(`/dashboard/pemilihan/${data.slug}`)
    })
  }, 300)


  // res.json(await PemiluModel.findById(id))
  // console.log(`/dashboard/pemilihan/${pemilihan._id}`)
  // res.redirect(`/dashboard/pemilihan/${pemilihan._id}`)
})


router.put("/ganti-sandi", async (req, res) => {
  const { sandiBaru, sandiLama } = req.body;

  if (sandiBaru === sandiLama) {
    res.status(406).json({ msg: "Sandi tidak berbeda" });
  }
  const cekSandiLama = await bcrypt.compare(
    sandiLama,
    req.session.user.password
  );
  if (!cekSandiLama) {
    res.status(406).json({ msg: "Sandi lama salah" });
  } else {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(sandiBaru, salt);
    await UserModel.findByIdAndUpdate(req.session.user._id, {
      password: passwordHash,
    });
    res.json({ msg: "sukses" });
  }
});

router.put("/update-foto-profil", UploadImage, async (req, res) => {
  if (!req.file) res.status(404).json({ msg: "foto belum di upload" });
  const foto = req.file.path;
  await UserModel.findByIdAndUpdate(req.session.user._id, {
    foto: foto,
  });
  res.redirect("/dashboard/profile");

});


router.put("/update-profile", async (req, res) => {
  if (!req.session.auth && !req.session.user) {
    res.status(405).json({ msg: "Anda ilegal" });
  }

  const { nama, nohp } = req.body;
  await UserModel.findByIdAndUpdate(req.session.user._id, { nama, nohp });
  const response = await UserModel.findById(req.session.user._id);
  if (response) res.json({ msg: "sukses", nama: response.nama });
});


router.put("/sidebar", async (req, res) => {
  const { sidebar } = req.body;
  await UserModel.findByIdAndUpdate(req.session.user._id, { sidebar })
  res.json({ sidebar });
});


// DELETE

router.delete('/pemilihan', async (req, res) => {
  await PemiluModel.findByIdAndRemove(req.body.id)
  res.redirect('/dashboard')
})

router.delete('/delete-calon', async (req, res) => {
  const { idCalon, slug } = req.body

  let pemilihan = await PemiluModel.findOne({ slug })

  pemilihan.calonDipilih.pull({ _id: idCalon })
  pemilihan.save()

  console.log(pemilihan.calonDipilih)
  res.send(generateCalon(pemilihan))

})
router.delete('/delete-field-pemilih', async (req, res) => {
  const { idField, slug } = req.body

  let pemilihan = await PemiluModel.findOne({ slug })

  pemilihan.fieldPemilih.pull({ _id: idField })
  pemilihan.save()

  console.log(pemilihan.calonDipilih)
  res.send(generateCalon(pemilihan))

})

router.delete('/delete-image', async (req, res) => {

  // Do delete.
  FroalaEditor.Image.delete(req.body.src, function (err) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }

    return res.end();
  });
});


// GET

router.get('/detail-calon/:slug/:idCalon', async (req, res) => {
  const { slug, idCalon } = req.params
  const pemilihan = await PemiluModel.findOne({ slug })

  const calon = pemilihan.calonDipilih.filter(calon => calon._id == idCalon)[0]

  const des = `<div id='editor'>
                <textarea name="deskripsiCalonEdit" id='deskripsiCalonEdit' style='margin-top: 30px;'>
                  ${calon.deskripsi}
              </textarea>
              </div>
              <script>new FroalaEditor('#deskripsiCalonEdit', {
                imageUploadURL: '/dashboard/upload_image',
              });</script>
              `

  res.json({ calon, des })
})

router.get('/detail-field-pemilih/:slug/:idField', async (req, res) => {
  const { slug, idField } = req.params
  const pemilihan = await PemiluModel.findOne({ slug })

  const fieldPemilih = pemilihan.fieldPemilih.filter(field => field._id == idField)[0]
  console.log('field pemilih', fieldPemilih)
  res.json(fieldPemilih)
})

router.get('/pemilihan/:slug/calon', async (req, res) => {
  const { slug } = req.params;
  const pemilihan = await PemiluModel.findOne({ slug });


  res.render("dashboard/pemilihan-calon", {
    layout: "layouts/main-layout",
    user: req.session.user,
    pemilihan: req.session.pemilihan,
    pemilihanDisini: pemilihan
  });
})

router.get('/pemilihan/:slug/pemilih', async (req, res) => {
  const { slug } = req.params;
  const pemilihan = await PemiluModel.findOne({ slug });


  res.render("dashboard/pemilihan-pemilih", {
    layout: "layouts/main-layout",
    user: req.session.user,
    pemilihan: req.session.pemilihan,
    pemilihanDisini: pemilihan
  });
})

router.get('/pemilihan/:slug/pengaturan', async (req, res) => {
  const { slug } = req.params;
  const pemilihan = await PemiluModel.findOne({ slug });


  res.render("dashboard/pemilihan-edit", {
    layout: "layouts/main-layout",
    user: req.session.user,
    pemilihan: req.session.pemilihan,
    pemilihanDisini: pemilihan
  });
})

router.get('/pemilihan/:slug', async (req, res) => {
  const { slug } = req.params;
  let pemilihan = await PemiluModel.findOne({ slug })
  if (!pemilihan) return res.redirect('/404')

  const waktuAwal = moment(pemilihan.waktuPelaksanaan.awal)
  const waktuAkhir = moment(pemilihan.waktuPelaksanaan.akhir)
  const waktuSekarang = moment()

  if (waktuAwal.diff(waktuSekarang) <= 0) {
    if (waktuAkhir.diff(waktuSekarang) <= 0) {
      pemilihan.statusPemilihan = 'telah berakhir'
    } else {
      pemilihan.statusPemilihan = 'sedang berlangsung'
    }
  } else {
    pemilihan.statusPemilihan = 'akan berlangsung'
  }
  pemilihan.save()



  pemilihan.waktuAwal = waktuAwal.format('D MMMM YYYY [pukul] HH.mm').toString()
  pemilihan.waktuAkhir = waktuAkhir.format('D MMMM YYYY [pukul] HH.mm').toString()
  pemilihan.host = req.get('host')


  res.render("dashboard/pemilihan", {
    layout: "layouts/main-layout",
    user: req.session.user,
    pemilihan: req.session.pemilihan,
    pemilihanDisini: pemilihan
  });
})

router.get("/tambah-pemilihan", (req, res) => {
  res.render("dashboard/tambah-pemilihan", {
    layout: "layouts/main-layout",
    user: req.session.user,
    pemilihan: req.session.pemilihan
  });
});

router.get("/profile", (req, res) => {
  res.render("dashboard/profile", {
    layout: "layouts/main-layout",
    user: req.session.user,
    pemilihan: req.session.pemilihan
  });
});


router.get("/", (req, res) => {
  res.render("dashboard/dashboard", {
    layout: "layouts/main-layout",
    user: req.session.user,
    pemilihan: req.session.pemilihan
  });
});

router.use('/', (req, res) => {
  res.render('404', { layout: 'layouts/buangan' })
})


export default router;
