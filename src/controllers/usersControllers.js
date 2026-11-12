import { User } from "../models/userModel.js"
import {HTTP_MESSAGE} from "../constants/index.js"
import {successResponse, errorResponse} from "../utils/index.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const getUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}

const postUsers = async (req, res) => {
    try {
        const body = req.body
        
        const {name, email, password } = body
        
        

        if(!email || !password){
            return res.status(400).json({error: "Se requiere correo y contraseña"})
        }
    
        const foundUser = await User.findOne({email})
        
        if (foundUser){
            return res.status(409).json ({error:"Usuario existente"})
        }

        const passwordEncrypted = await bcryptjs.hash(password,10)
    
        const newUser = await User.create({name, email, password: passwordEncrypted})
    
        res.status(201).json(successResponse(newUser,"Usuario creado correctamente"))
    } catch (error) {
        res.status(500).json({error: HTTP_MESSAGE.createErrorFilm})
    }
}

const loginUsers = async (req, res) => {
    try {

        const {email, password } = req.body
    
        if(!email || !password){
            return res.status(400).json({error: "Se requiere correo y contraseña"})
        }

         if(!email.endsWith("@gmail.com")){
            return res.status(400).json({error: "Correo invalido"})
        }
    
        const foundUser = await User.findOne({email})
        
        if (!foundUser){
            return res.status(401).json ({error:"Usario o contraseña incorrecta"})
        }
        
        const passwordValidated = await bcryptjs.compare(password, foundUser.password)

        if (!passwordValidated){
            return res.status(401).json ({error:"Usario o contraseña incorrecta"})
        }

        const token = jwt.sign({name: foundUser.name}, process.env.JWT_SECRET, {expiresIn: "1h"})
        
        res.status(201).json(successResponse(token,"Inicio de sesion exitosamente"))
    } catch (error) {
        res.status(500).json({error: HTTP_MESSAGE.createErrorFilm})
    }
}

export {getUsers, postUsers, loginUsers}