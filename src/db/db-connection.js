const mysql = require('mysql');

class DBConnection {
    constructor() {
        this.db = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "secr3t",
            database: 'chat_app'
        });

        this.db.connect(err => {
            if (err) throw err;
            console.log("MySQL Connected!");
        });

    }

    async query(sql, values) {
        const self = this;
        return new Promise((resolve, reject) => {
            const callback = (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            }
            // execute will internally call prepare and query
            self.db.query(sql, values, callback);
        }).catch(err => {
            const mysqlErrorList = Object.keys(HttpStatusCodes);
            // convert mysql errors which in the mysqlErrorList list to http status code
            err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

            throw err;
        });
    }
}

// like ENUM
const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
});

let dbConnection = new DBConnection();
module.exports = dbConnection.query.bind(dbConnection);