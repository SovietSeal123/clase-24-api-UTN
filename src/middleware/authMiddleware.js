import jwt from "jsonwebtoken"

process.loadEnvFile()

const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization
                console.log(header)
                
                if (!header) {
                    return res.status(401).json({error:"token requerido"})
                }
                const token = header.split(" ")[1]
                
                if (!token) {
                    return res.status(401).json({error:"Formato de token requerido"})
                }
        
                const isValid = jwt.verify(token, process.env.JWT_SECRET)

                if(!isValid){
                    return res.status(401).json({error: "Formato de token invalido"})
                }
                next()

    } catch (error) {
        if (error.name === "JsonWebTokenError"){
            return res.status(401).json({error:"Token invalido"})
        }
        if (error.name === "TokenExpiredError"){
            return res.status(401).json({error:"Token expirado"})
        }
        return res.status(500).json({error:"Error interno del servidor"})
    }
}

export {authMiddleware}