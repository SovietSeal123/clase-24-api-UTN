import mongoose from "mongoose"

//schema -> esquema que valida los datos de cada propiedad

const filmSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    year: {type: Number, required: true},
    genre: {type: String, default: "generic"}
}, {
    versionKey:false
})

// Film.find({title: body.title, year: body.year})

// model -> Permite utilizar metodos de Mongodb

const Film = mongoose.model("Film", filmSchema)

export {Film}