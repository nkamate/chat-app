const query = require('../db/db-connection');
const {multipleColumnSet} = require('../utils/common.utils');

class UserModel {

    async updateUser({id, username}) {
        const sql = `UPDATE user SET username = "${username}" WHERE id = ${id};`
        const result = await query(sql);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    async find(params = {}) {
        const tableName = 'user';
        let sql = `SELECT * FROM ${tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const {columnSet, values} = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }
}

module.exports = new UserModel;