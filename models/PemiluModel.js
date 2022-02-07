import mongoose from 'mongoose'
import URLslug from 'mongoose-slug-generator'

mongoose.plugin(URLslug);

const calonDipilih = new mongoose.Schema({
    nama: { type: String },
    deskripsi: { type: String, default:"<h1>Buat Deskripsi Disini</h1>" },
    foto: { type: String },
    grup: { type: String , default: 'tidak ada'},
    jumlahSuara: { type: Number, default: 0 }
})

const waktuPelaksanaan = new mongoose.Schema({
    awal: { type: Date },
    akhir: { type: Date },
});

const pemiluSchema = new mongoose.Schema({
    //id pemilik
    pemilik: mongoose.Schema.Types.ObjectId,
    //slug
    
    namaPemilihan: { type: String, required: true },

    slug: { type: String, slug: 'namaPemilihan', unique: true },


    // apakah pemilu terbuka atau tertutup
    pemilihanTerbuka: { type: Boolean, required: true, default: true },
    perhitunganLive: { type: Boolean, required: false, default: false },

    waktuPelaksanaan: waktuPelaksanaan,
    
    // status pemilu
    statusPemilihan: { type: String, required: false },


    // optional
    deskripsi: { type: String, required: false },
    fotoKampanye: { type: String, required: false },
    videoKampanye: { type: String, required: false },


    // Mode Group
    modeGroup : {type: Boolean, default: false},
    fieldGroup: [String],


    calonDipilih: [calonDipilih],
    fieldPemilih: [String],
    pemilih: [mongoose.Schema.Types.Mixed]
})

const PemiluModel = mongoose.model("pemilu", pemiluSchema)
// const CalonModel = mongoose.model("calonDipilih", calonDipilih)

// export {CalonModel}

export default PemiluModel
