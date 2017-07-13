"use strict";

function isApiRequest(path) {
    return path.indexOf('/api/') === 0;
}

module.exports = {

    /**
     * Send correct headers to handle cross-origin requests
     * @param app
     * @returns {Function}
     */
    crossOrigin: function (app) {

        return function (req, res, next) {

            if (isApiRequest(req.path)) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                res.header('Content-Type', 'application/json; charset=utf-8');
                if (req.method === 'OPTIONS')
                    return res.sendStatus(200); // preflight
            }

            return next();
        }
    }

};