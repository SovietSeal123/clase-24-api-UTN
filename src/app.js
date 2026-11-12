import express from "express"
import cors from "cors"
import {HTTP_MESSAGE} from "./constants/index.js"
import { filmsRouter } from "./routes/filmsRouter.js"
import { connectMongoDB } from "./config/connectMongoDB.js"
import { usersRouter } from "./routes/usersRouter.js"
import { authMiddleware } from "./middleware/authMiddleware.js"

process.loadEnvFile()

const PORT = process.env.PORT
const URI_DB = process.env.URI_DB

const server = express()
server.use(express.json())
server.use(cors())

server.get("/", async (req, res) => {
    
    try {
       res.json({
        status: {
            ok: true,
            description: "All Systems Operational"
        }
       })
    } catch (error) {
        res.status(500).json({error: HTTP_MESSAGE.mongooseError})
    }
    
})


server.use("/films", authMiddleware, filmsRouter)
server.use("/users", usersRouter)

server.use((req, res) => {
    res.status(404).json({ error: "No se encuentra el recurso" })
})

const startServer = async () => {
    try {
        await connectMongoDB(URI_DB)

        server.listen(PORT, () => {
            console.log(`Servidor en escucha en http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error)
    }
}

startServer()