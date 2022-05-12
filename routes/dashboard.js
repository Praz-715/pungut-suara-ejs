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
    datanya.filter((s => v => s.has(v) || !s.add(v))(new Set)).length > 0 ? datanya = [... new Set(datanya)] : null;

    const dataYangTidakSamaDiDatabase = datanya.filter(e => !pemilihYangSudahTerdaftar.includes(e))
    datanya = dataYangTidakSamaDiDatabase
    console.log('dataYangSamaDiDatabase ? ', dataYangTidakSamaDiDatabase)

    console.log('datanya ? ', datanya)

    // console.log(pemilu.pemilih.push({ key: 'abc' }))
    datanya.forEach((kambing, index) => {
      pemilu.pemilih.push({ key: kambing })
    })
    pemilu.save()
    console.log('pemilihnya ? ', pemilu.pemilih.map(e => e.key))

    // console.log('datanya ? ',datanya)
    // hapus isi pemilih
    // await PemiluModel.findOneAndUpdate({ slug }, { $set: { pemilih: [] } })






    res.send(`${datanya.length} ditambahkan`)
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

router.get('/pemilih/slugnya', async (req, res) => {
  const data = {
    "data": [
      {
        "id": "1",
        "name": "Tiger Nixon",
        "position": "System Architect",
        "salary": "$320,800",
        "start_date": "2011/04/25",
        "office": "Edinburgh",
        "extn": "5421"
      },
      {
        "id": "2",
        "name": "Garrett Winters",
        "position": "Accountant",
        "salary": "$170,750",
        "start_date": "2011/07/25",
        "office": "Tokyo",
        "extn": "8422"
      },
      {
        "id": "3",
        "name": "Ashton Cox",
        "position": "Junior Technical Author",
        "salary": "$86,000",
        "start_date": "2009/01/12",
        "office": "San Francisco",
        "extn": "1562"
      },
      {
        "id": "4",
        "name": "Cedric Kelly",
        "position": "Senior Javascript Developer",
        "salary": "$433,060",
        "start_date": "2012/03/29",
        "office": "Edinburgh",
        "extn": "6224"
      },
      {
        "id": "5",
        "name": "Airi Satou",
        "position": "Accountant",
        "salary": "$162,700",
        "start_date": "2008/11/28",
        "office": "Tokyo",
        "extn": "5407"
      },
      {
        "id": "6",
        "name": "Brielle Williamson",
        "position": "Integration Specialist",
        "salary": "$372,000",
        "start_date": "2012/12/02",
        "office": "New York",
        "extn": "4804"
      },
      {
        "id": "7",
        "name": "Herrod Chandler",
        "position": "Sales Assistant",
        "salary": "$137,500",
        "start_date": "2012/08/06",
        "office": "San Francisco",
        "extn": "9608"
      },
      {
        "id": "8",
        "name": "Rhona Davidson",
        "position": "Integration Specialist",
        "salary": "$327,900",
        "start_date": "2010/10/14",
        "office": "Tokyo",
        "extn": "6200"
      },
      {
        "id": "9",
        "name": "Colleen Hurst",
        "position": "Javascript Developer",
        "salary": "$205,500",
        "start_date": "2009/09/15",
        "office": "San Francisco",
        "extn": "2360"
      },
      {
        "id": "10",
        "name": "Sonya Frost",
        "position": "Software Engineer",
        "salary": "$103,600",
        "start_date": "2008/12/13",
        "office": "Edinburgh",
        "extn": "1667"
      },
      {
        "id": "11",
        "name": "Jena Gaines",
        "position": "Office Manager",
        "salary": "$90,560",
        "start_date": "2008/12/19",
        "office": "London",
        "extn": "3814"
      },
      {
        "id": "12",
        "name": "Quinn Flynn",
        "position": "Support Lead",
        "salary": "$342,000",
        "start_date": "2013/03/03",
        "office": "Edinburgh",
        "extn": "9497"
      },
      {
        "id": "13",
        "name": "Charde Marshall",
        "position": "Regional Director",
        "salary": "$470,600",
        "start_date": "2008/10/16",
        "office": "San Francisco",
        "extn": "6741"
      },
      {
        "id": "14",
        "name": "Haley Kennedy",
        "position": "Senior Marketing Designer",
        "salary": "$313,500",
        "start_date": "2012/12/18",
        "office": "London",
        "extn": "3597"
      },
      {
        "id": "15",
        "name": "Tatyana Fitzpatrick",
        "position": "Regional Director",
        "salary": "$385,750",
        "start_date": "2010/03/17",
        "office": "London",
        "extn": "1965"
      },
      {
        "id": "16",
        "name": "Michael Silva",
        "position": "Marketing Designer",
        "salary": "$198,500",
        "start_date": "2012/11/27",
        "office": "London",
        "extn": "1581"
      },
      {
        "id": "17",
        "name": "Paul Byrd",
        "position": "Chief Financial Officer (CFO)",
        "salary": "$725,000",
        "start_date": "2010/06/09",
        "office": "New York",
        "extn": "3059"
      },
      {
        "id": "18",
        "name": "Gloria Little",
        "position": "Systems Administrator",
        "salary": "$237,500",
        "start_date": "2009/04/10",
        "office": "New York",
        "extn": "1721"
      },
      {
        "id": "19",
        "name": "Bradley Greer",
        "position": "Software Engineer",
        "salary": "$132,000",
        "start_date": "2012/10/13",
        "office": "London",
        "extn": "2558"
      },
      {
        "id": "20",
        "name": "Dai Rios",
        "position": "Personnel Lead",
        "salary": "$217,500",
        "start_date": "2012/09/26",
        "office": "Edinburgh",
        "extn": "2290"
      },
      {
        "id": "21",
        "name": "Jenette Caldwell",
        "position": "Development Lead",
        "salary": "$345,000",
        "start_date": "2011/09/03",
        "office": "New York",
        "extn": "1937"
      },
      {
        "id": "22",
        "name": "Yuri Berry",
        "position": "Chief Marketing Officer (CMO)",
        "salary": "$675,000",
        "start_date": "2009/06/25",
        "office": "New York",
        "extn": "6154"
      },
      {
        "id": "23",
        "name": "Caesar Vance",
        "position": "Pre-Sales Support",
        "salary": "$106,450",
        "start_date": "2011/12/12",
        "office": "New York",
        "extn": "8330"
      },
      {
        "id": "24",
        "name": "Doris Wilder",
        "position": "Sales Assistant",
        "salary": "$85,600",
        "start_date": "2010/09/20",
        "office": "Sydney",
        "extn": "3023"
      },
      {
        "id": "25",
        "name": "Angelica Ramos",
        "position": "Chief Executive Officer (CEO)",
        "salary": "$1,200,000",
        "start_date": "2009/10/09",
        "office": "London",
        "extn": "5797"
      },
      {
        "id": "26",
        "name": "Gavin Joyce",
        "position": "Developer",
        "salary": "$92,575",
        "start_date": "2010/12/22",
        "office": "Edinburgh",
        "extn": "8822"
      },
      {
        "id": "27",
        "name": "Jennifer Chang",
        "position": "Regional Director",
        "salary": "$357,650",
        "start_date": "2010/11/14",
        "office": "Singapore",
        "extn": "9239"
      },
      {
        "id": "28",
        "name": "Brenden Wagner",
        "position": "Software Engineer",
        "salary": "$206,850",
        "start_date": "2011/06/07",
        "office": "San Francisco",
        "extn": "1314"
      },
      {
        "id": "29",
        "name": "Fiona Green",
        "position": "Chief Operating Officer (COO)",
        "salary": "$850,000",
        "start_date": "2010/03/11",
        "office": "San Francisco",
        "extn": "2947"
      },
      {
        "id": "30",
        "name": "Shou Itou",
        "position": "Regional Marketing",
        "salary": "$163,000",
        "start_date": "2011/08/14",
        "office": "Tokyo",
        "extn": "8899"
      },
      {
        "id": "31",
        "name": "Michelle House",
        "position": "Integration Specialist",
        "salary": "$95,400",
        "start_date": "2011/06/02",
        "office": "Sydney",
        "extn": "2769"
      },
      {
        "id": "32",
        "name": "Suki Burks",
        "position": "Developer",
        "salary": "$114,500",
        "start_date": "2009/10/22",
        "office": "London",
        "extn": "6832"
      },
      {
        "id": "33",
        "name": "Prescott Bartlett",
        "position": "Technical Author",
        "salary": "$145,000",
        "start_date": "2011/05/07",
        "office": "London",
        "extn": "3606"
      },
      {
        "id": "34",
        "name": "Gavin Cortez",
        "position": "Team Leader",
        "salary": "$235,500",
        "start_date": "2008/10/26",
        "office": "San Francisco",
        "extn": "2860"
      },
      {
        "id": "35",
        "name": "Martena Mccray",
        "position": "Post-Sales support",
        "salary": "$324,050",
        "start_date": "2011/03/09",
        "office": "Edinburgh",
        "extn": "8240"
      },
      {
        "id": "36",
        "name": "Unity Butler",
        "position": "Marketing Designer",
        "salary": "$85,675",
        "start_date": "2009/12/09",
        "office": "San Francisco",
        "extn": "5384"
      },
      {
        "id": "37",
        "name": "Howard Hatfield",
        "position": "Office Manager",
        "salary": "$164,500",
        "start_date": "2008/12/16",
        "office": "San Francisco",
        "extn": "7031"
      },
      {
        "id": "38",
        "name": "Hope Fuentes",
        "position": "Secretary",
        "salary": "$109,850",
        "start_date": "2010/02/12",
        "office": "San Francisco",
        "extn": "6318"
      },
      {
        "id": "39",
        "name": "Vivian Harrell",
        "position": "Financial Controller",
        "salary": "$452,500",
        "start_date": "2009/02/14",
        "office": "San Francisco",
        "extn": "9422"
      },
      {
        "id": "40",
        "name": "Timothy Mooney",
        "position": "Office Manager",
        "salary": "$136,200",
        "start_date": "2008/12/11",
        "office": "London",
        "extn": "7580"
      },
      {
        "id": "41",
        "name": "Jackson Bradshaw",
        "position": "Director",
        "salary": "$645,750",
        "start_date": "2008/09/26",
        "office": "New York",
        "extn": "1042"
      },
      {
        "id": "42",
        "name": "Olivia Liang",
        "position": "Support Engineer",
        "salary": "$234,500",
        "start_date": "2011/02/03",
        "office": "Singapore",
        "extn": "2120"
      },
      {
        "id": "43",
        "name": "Bruno Nash",
        "position": "Software Engineer",
        "salary": "$163,500",
        "start_date": "2011/05/03",
        "office": "London",
        "extn": "6222"
      },
      {
        "id": "44",
        "name": "Sakura Yamamoto",
        "position": "Support Engineer",
        "salary": "$139,575",
        "start_date": "2009/08/19",
        "office": "Tokyo",
        "extn": "9383"
      },
      {
        "id": "45",
        "name": "Thor Walton",
        "position": "Developer",
        "salary": "$98,540",
        "start_date": "2013/08/11",
        "office": "New York",
        "extn": "8327"
      },
      {
        "id": "46",
        "name": "Finn Camacho",
        "position": "Support Engineer",
        "salary": "$87,500",
        "start_date": "2009/07/07",
        "office": "San Francisco",
        "extn": "2927"
      },
      {
        "id": "47",
        "name": "Serge Baldwin",
        "position": "Data Coordinator",
        "salary": "$138,575",
        "start_date": "2012/04/09",
        "office": "Singapore",
        "extn": "8352"
      },
      {
        "id": "48",
        "name": "Zenaida Frank",
        "position": "Software Engineer",
        "salary": "$125,250",
        "start_date": "2010/01/04",
        "office": "New York",
        "extn": "7439"
      },
      {
        "id": "49",
        "name": "Zorita Serrano",
        "position": "Software Engineer",
        "salary": "$115,000",
        "start_date": "2012/06/01",
        "office": "San Francisco",
        "extn": "4389"
      },
      {
        "id": "50",
        "name": "Jennifer Acosta",
        "position": "Junior Javascript Developer",
        "salary": "$75,650",
        "start_date": "2013/02/01",
        "office": "Edinburgh",
        "extn": "3431"
      },
      {
        "id": "51",
        "name": "Cara Stevens",
        "position": "Sales Assistant",
        "salary": "$145,600",
        "start_date": "2011/12/06",
        "office": "New York",
        "extn": "3990"
      },
      {
        "id": "52",
        "name": "Hermione Butler",
        "position": "Regional Director",
        "salary": "$356,250",
        "start_date": "2011/03/21",
        "office": "London",
        "extn": "1016"
      },
      {
        "id": "53",
        "name": "Lael Greer",
        "position": "Systems Administrator",
        "salary": "$103,500",
        "start_date": "2009/02/27",
        "office": "London",
        "extn": "6733"
      },
      {
        "id": "54",
        "name": "Jonas Alexander",
        "position": "Developer",
        "salary": "$86,500",
        "start_date": "2010/07/14",
        "office": "San Francisco",
        "extn": "8196"
      },
      {
        "id": "55",
        "name": "Shad Decker",
        "position": "Regional Director",
        "salary": "$183,000",
        "start_date": "2008/11/13",
        "office": "Edinburgh",
        "extn": "6373"
      },
      {
        "id": "56",
        "name": "Michael Bruce",
        "position": "Javascript Developer",
        "salary": "$183,000",
        "start_date": "2011/06/27",
        "office": "Singapore",
        "extn": "5384"
      },
      {
        "id": "57",
        "name": "Donna Snider",
        "position": "Customer Support",
        "salary": "$112,000",
        "start_date": "2011/01/25",
        "office": "New York",
        "extn": "4226"
      }
    ],
    "columns": [
      {
        "title": "One",
        "data": "One"
      },
      {
   
        "title": "Two",
        "data": "Two"
      },
      {
        "title": "Three",
        "data": "Three"
      }
    ],
  }
  console.log(req.query)
  res.json(data)
})

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
