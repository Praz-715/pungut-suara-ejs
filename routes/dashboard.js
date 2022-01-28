import express from "express";
import { UploadImage } from "../middleware/UploadImage.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

const router = express.Router();



router.get("/tambah-pemilihan", (req, res) => {
  res.render("dashboard/tambah-pemilihan", {
    layout: "layouts/main-layout",
    user: req.session.user,
  });
});

router.get("/profile", (req, res) => {
  res.render("dashboard/profile", {
    layout: "layouts/main-layout",
    user: req.session.user,
  });
});

router.post("/tambah-pemilihan", (req, res) => {
  const { namaPemilihan, sifatPemilihan, waktuBerlangsung } = req.body;
  res.send("ok");
});

router.post("/update-foto-profil", UploadImage, async (req, res) => {
  if (!req.file) res.status(404).json({ msg: "foto belum di upload" });
  const foto = req.file.path;
  await UserModel.findByIdAndUpdate(req.session.user.id, {
    foto: foto,
  });
  res.redirect("/dashboard/profile");
});

router.post("/ganti-sandi", async (req, res) => {
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
    await UserModel.findByIdAndUpdate(req.session.user.id, {
      password: passwordHash,
    });
    res.json({ msg: "sukses" });
  }

  // const salt = await bcrypt.genSalt();
  // const passwordHash = await bcrypt.hash('admin', salt)
  // await UserModel.findByIdAndUpdate(req.session.user.id, { password: passwordHash })
  // res.json({ msg: "ok" })
});

router.post("/update-profile", async (req, res) => {
  if (!req.session.auth && !req.session.user) {
    res.status(405).json({ msg: "Anda ilegal" });
  }

  const { nama, nohp } = req.body;
  await UserModel.findByIdAndUpdate(req.session.user.id, { nama, nohp });
  const response = await UserModel.findById(req.session.user.id);
  if (response) res.json({ msg: "sukses", nama: response.nama });
});

router.post("/sidebar", async(req, res) => {
  const { sidebar } = req.body;
  await UserModel.findByIdAndUpdate(req.session.user.id, {sidebar})
  res.json({ sidebar });
});

router.get("/", (req, res) => {
  res.render("dashboard/dashboard", {
    layout: "layouts/main-layout",
    user: req.session.user,
  });
});

router.use('/', (req,res)=>{
  res.render('404',{layout: 'layouts/buangan'})
})


export default router;
