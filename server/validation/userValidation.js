import Joi from "joi"
import { createValidation } from "../middlewares/validation.js"

const signUpValidation = createValidation(
    Joi.object({
        name: Joi.string().required().min(2).max(30).messages(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(30).pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$")).messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
        }),
        phone: Joi.string().optional(),
        address: Joi.string().optional(),
    }
    ))

const loginValidation = createValidation(
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(30).pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$")).messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
        })
    })
)

export { signUpValidation, loginValidation }










