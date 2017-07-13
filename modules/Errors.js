"use strict";

module.exports = {

    errors: {
        unauthorized: {
            error: {
                code: 401,
                message: "Unauthorized"
            }
        },
        unauthorizedUser: {
            error: {
                code: 402,
                message: "This user cannot login on this website"
            }
        },
        missingParameters: {
            error: {
                code: 500,
                message: "Missing parameters"
            }
        },
        internalError: {
            error: {
                code: 500,
                message: "Internal Server Error"
            }
        }
    },

    _sendResponse: function (res, error, code, custom_message) {
        res.status(code);
        let custom_error = error;
        if (custom_message && (typeof custom_message === 'string' || custom_message instanceof String)) {
            custom_error = Object.assign({}, error);
            custom_error.error.message = custom_message;
        }
        res.send(custom_error);
    },

    sendUnauthorizedResponse: function (res, custom_message) {
        this._sendResponse(res, this.errors.unauthorized, 401, custom_message)
    },

    sendMissingParametersResponse: function (res, custom_message) {
        this._sendResponse(res, this.errors.missingParameters, 500, custom_message)
    },

    sendGenericErrorResponse: function (res, custom_message) {
        this._sendResponse(res, this.errors.internalError, 400, custom_message)
    },

    sendInternalErrorResponse: function (res, custom_message) {
        this._sendResponse(res, this.errors.internalError, 500, custom_message)
    }

};