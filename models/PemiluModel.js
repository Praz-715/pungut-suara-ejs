import mongoose from 'mongoose'
import URLSlug from 'mongoose-slug-generator'

mongoose.plugin(URLSlug);

const calonDipilih = new mongoose.Schema({
    nama: { type: String },
    deskripsi: { type: String },
    foto: { type: String },
    jumlahSuara: { type: Number, default: 0 }
})

const pelaksanaan = new mongoose.Schema({
    awal: { type: Date },
    akhir: { type: Date },
});

const pemiluSchema = new mongoose.Schema({
    pemilik: mongoose.Schema.Types.ObjectId,
    namaPemilu: { type: String, required: true },
    slug: { type: String, unique: true, slug: 'namaPemilu' },
    sifatPublic: { type: Boolean, default: true },
    waktuPelaksanaan: pelaksanaan,
    deskripsi: { type: String, required: false },
    fotoKampanye: { type: String, required: false },
    videoKampanye: { type: String, required: false },
    statusPemilu: { type: String, required: true, default: 'WILL' },
    calonDipilih: [calonDipilih],
    fieldPemilih: [String],
    pemilih: [mongoose.Schema.Types.Mixed]
})

export default mongoose.model("pemilu", pemiluSchema);