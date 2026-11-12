import {Router} from "express"
import { filterFilms, getFilms, postFilms, patchFilms, deleteFilms } from "../controllers/filmController.js"


const filmsRouter = Router()


filmsRouter.get("/", getFilms)

filmsRouter.get("/search", filterFilms)

filmsRouter.post("/", postFilms)

filmsRouter.patch("/:id", patchFilms)

filmsRouter.delete("/:id", deleteFilms)

export {filmsRouter}