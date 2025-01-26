/* eslint-disable @typescript-eslint/no-explicit-any */
/**
* @file custom validator
* @description This file handles the custom validation
* which changes the message into a user-friendly format
* @author Aadi Rocks
* @created 2025-01-10
*/

const Joi = require('joi');
// const { USER_MSG } = require('../user/v1/user.response');
// const { PATTERN_CHECK } = require('@common');

/**
 * Function which handles the validation schema and modifies the error message for Joi.
 * @param {Joi.ObjectSchema} schema - The Joi validation schema.
 * @param {string | function} dataResolver - Where to pull the data from (body, query, params, etc).
 * @param {boolean} checkHeaders - Whether to check headers for device info.
 */
module.exports.validateSchema = (schema, dataResolver = 'body', checkHeaders = false) => {
    return (req, res, next) => {
        try {
            // Resolve the data based on the resolver
            const data = typeof dataResolver === 'function' ? dataResolver(req) : req[dataResolver];

            const validationResult = schema.validate(data, { abortEarly: false });

            // Only validate headers if header validation is requested
            if (checkHeaders) {
                if (!req.headers['devicetoken']) {
                    return res.status(400).json({
                        error: true,
                        errorType: 'AUTHORIZATION_ERROR',
                        errors: { devicetoken: 'Device token is required in headers' },
                    });
                }

                if (!req.headers['deviceid']) {
                    return res.status(400).json({
                        error: true,
                        errorType: 'AUTHORIZATION_ERROR',
                        errors: { deviceid: 'Device Id is required in headers' },
                    });
                }
            }

            // Check if validation failed
            if (validationResult.error) {
                const errorDetails = {};

                // Handling custom error message, if details key is missing
                if (!validationResult.error.details && validationResult.error.message) {
                    return res.status(400).json({
                        error: true,
                        errorType: 'VALIDATION_ERROR',
                        errors: { h: validationResult.error.message },
                    });
                }

                validationResult.error.details.forEach((err) => {
                    const fieldName = err.path.join('.');

                    const message = err.type === 'string.pattern.base'
                        ? err.message.split(':')[0].replace(/['"]/g, '')
                        : err.message.replace(/['"]/g, '');

                    errorDetails[fieldName] = handleErrorMessage(fieldName, message);
                });

                // Send the error response and return to prevent further processing
                return res.status(400).json({
                    error: true,
                    errorType: 'VALIDATION_ERROR',
                    errors: errorDetails,
                });
            }

            // Store validated data
            req.validatedData = validationResult.value;

            // Continue to the next middleware if everything is valid
            return next();
        } catch (error) {
            // Catch any unexpected errors and pass them to the next middleware
            return next(error);
        }
    };
}

/**
 * Custom error message handler.
 * @param {string} field - The field being validated.
 * @param {string} message - The validation message.
 * @returns {string} - The custom error message.
 */
const handleErrorMessage = (field, message) => {
    if (field === 'email') {
        return 'USER_MSG.INCORRECT_EMAIL';
    } else if (field === 'password') {
        return 'USER_MSG.INVALID_FORMAT_PASSWORD';
    }
    return message;
};

// module.exports = { validateSchema };
