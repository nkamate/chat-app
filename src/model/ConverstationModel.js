const query = require('../db/db-connection');

class ConversationModel {

    async add(from, to, msg) {
        const sql = `INSERT INTO conversation
                         (fromUser, toUser, msg)
                     VALUES (?, ?, ?)`;

        const result = await query(sql, [from, to, msg]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }


    async find(params = {}) {
        const sql = `select * from conversation where (fromUser = ${params.fromUser} and toUser = ${params.toUser}) or (fromUser = ${params.toUser} and toUser = ${params.fromUser}) order by timestamp asc;`
        return await query(sql);
    }


}

module.exports = new ConversationModel;