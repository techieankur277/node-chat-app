const Joi = require('joi');
const { validateSchema } = require('../utils/validator.utils');

module.exports.VALIDATION = {
    SIGNUP: validateSchema(
        Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
        })
    ),

    LOGIN: validateSchema(
        Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        })
    )
}
