import {Router} from "express"
import { getUsers, postUsers, loginUsers } from "../controllers/usersControllers.js"

const usersRouter = Router()

usersRouter.get("/", getUsers)

usersRouter.post("/register", postUsers)

usersRouter.post("/login", loginUsers)

export {usersRouter}