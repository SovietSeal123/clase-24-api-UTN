import { Film } from "../models/filmModel.js"
import { HTTP_MESSAGE } from "../constants/index.js"
import {successResponse, errorResponse} from "../utils/index.js"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { filmSchema } from "../validators/filmValidator.js"
import dotenv from "dotenv"

dotenv.config()

const filterFilms = async (req, res) => {
    try {
        const {
            title,
            genre,
            year,
            yearFrom,
            yearTo,
            limit,
            offset
        } = req.query

        const filters = {}

        if (title) {
            filters.title = new RegExp(title, "i")
        }

        if (genre) {
            filters.genre = genre
        }

        if (year) {
            filters.year = Number(year)
        }

        if (yearFrom || yearTo) {
            filters.year = {}

            if (yearFrom) {
                filters.year.$gte = Number(yearFrom)
            }

            if (yearTo) {
                filters.year.$lt = Number(yearTo)
            }
        }

        const films = await Film.find(filters)
            .limit(limit ? Number(limit) : 0)
            .skip(offset ? Number(offset) : 0)

        res.json(films)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: HTTP_MESSAGE.mongooseError })
    }
}


const getFilms = async (req, res) => {
    
    try {
        const films = await Film.find()
        res.json(successResponse(films, "Peliculas recuperadas con exito"))
    } catch (error) {
        console.log(error)
        res.status(500).json(errorResponse(films, HTTP_MESSAGE.mongooseError))
    }
    
}

const postFilms = async (req, res) => {
    
    try {
        const body = req.body

        const validation = filmSchema.safeParse(body)

        if (!validation.success){
            return res.status(400).json({error: validation.error.issues.map(e => ({
                origin: e.path[0],
                message:e.message
            }))})
        }
    
        const foundFilm = await Film.findOne({title: body.title})
        
        if (foundFilm){
            return res.status(409).json ({error:"La pelicula ya existe"})
        }
    
        const newFilm = await Film.create(body)
    
        res.status(201).json(successResponse(newFilm,"Pelicula agregada exitosamente"))
    } catch (error) {
        console.log(error)
        res.status(500).json({error: HTTP_MESSAGE.createErrorFilm})
    }
    
}

const patchFilms = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body

        if (!mongoose.isValidObjectId(id)){
            const error = new Error ("ID invalido")
            error.name = "invalidId"
            throw error 
        }

        const validation = filmSchema.partial().safeParse(body)

        if (!validation.success){
            return res.status(400).json({error: validation.error.issues.map(e => ({
                origin: e.path[0],
                message:e.message
            }))})
        }
    
        
        const updatedFilm = await Film.findByIdAndUpdate(id, body, {new: true})
    
        if (!updatedFilm){
            return res.status(404).json ({error:"La pelicula no existe"})
        }
    
        res.json(successResponse(updatedFilm,"Pelicula actualizada correctamente"))
    } catch (error) {
        if(error.name === "invalidId"){
            return res.status(400).json({error: "ID invalido"})
        }
        res.status(500).json({error: HTTP_MESSAGE.createErrorFilm})
    }
    
}

const deleteFilms = async (req, res) => {
    try{
        const id = req.params.id
        const deletedFilm = await Film.findByIdAndDelete(id)
        
        if (!mongoose.isValidObjectId(id)){
           return res.status(400).json({error: "ID invalido"})
        }

        if (!deletedFilm){
            return res.status(404).json ({error:"La pelicula no existe"})
        }

        res.json(successResponse(deletedFilm,"Pelicula borrada exitosamente"))
    }catch(error){
        if(error.name === "CastError"){
            res.status(400).json({error: "El ID debe ser formato ObjectID"})
        }
        res.status(500).json({error: "Error interno"})
    }
}

export {filterFilms , getFilms, postFilms, patchFilms, deleteFilms}