import mongoose from "mongoose"

const connectMongoDB = async (uri) => {
   try{
        await mongoose.connect(uri)
        console.log("Conectado")
    } catch (error){
        console.log(error)
        console.log("No se pudo conectar")
   }
}

export {connectMongoDB}