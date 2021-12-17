import Joi from "joi";
import {GROUP_PERMISSIONS} from "../constants/constants";

export const validationSchemeForUser = Joi.object({
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

export const validationSchemeForGroup = Joi.object({
    name: Joi.string()
        .required(),
    permission: Joi.array().min(1).items(Joi.string().valid(...GROUP_PERMISSIONS)),
});