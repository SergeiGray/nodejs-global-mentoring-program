import Joi from "joi";

export const validationSchemeForNewUser = Joi.object({
    login: Joi.string()
        .required(),
    password: Joi.string()
        .pattern(new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])'))
        .required(),
    age: Joi.number()
        .min(4)
        .max(130)
        .required(),
});