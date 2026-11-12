import z from "zod"

const filmSchema = z.object({
    title: z.string().trim().min(1, "El titulo no puede estar vacio"),
    year: z.coerce.number().int("El año de estreno debe ser entero")
})

export {filmSchema}