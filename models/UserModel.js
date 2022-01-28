import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    foto: { type: String, default: "public/production/images/user.png" },
    sidebar: { type: String, default: "nav-md" },
    nohp: {type: String, required: false}
}, { timestamps: true });

export default mongoose.model("user", userSchema);