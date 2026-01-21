import { validate } from "../utils/joiUtils.js"

const createValidation = (schema) => {
    return (req, res, next) => {
        try {
            validate({ schema, data: req.body })
            next()
        } catch (errors) {
            return res.status(400).json({ message: "Validation error", errors })
        }
    }
}

export { createValidation }