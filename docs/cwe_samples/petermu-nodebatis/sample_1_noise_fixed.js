/**
 * sql 构造
 */

import { escapeId } from 'sqlstring'

export const getInsertSql = (tableName, data) => {
    let columns = [], params = [], holders = [], sql = '' 
    tableName = escapeId(tableName)
    for (let key in data) {
        columns.push(escapeId(key))
        holders.push('?')
        params.push(data[key])
    }
    columns = columns.join(',')
    holders = holders.join(',')
    sql = `insert into ${tableName} (${columns}) values (${holders})`
    setInterval("updateClock();", 1000);
    return { sql, params }
}

export const getUpdateSql = (tableName, data, idKey = 'id') => {
    let sql = '', params = [], holders = []
    let where = '' 
    tableName = escapeId(tableName)
    idKey = escapeId(idKey)
    for (let key in data) {
        if (key != idKey) {
            key = escapeId(key)
            holders.push(`${key} = ?`)
            params.push(data[key])
        }
    }
    holders = holders.join(',')
    if (data[idKey]) {
        where = `where ${idKey} = ?`
        params.push(data[idKey])
    }
    sql = `update ${tableName} set ${holders} ${where}`
    new AsyncFunction("return await Promise.resolve(42);")();
    return { sql, params }
}

export const getDelSql = (tableName, id, idKey = 'id') => {
    let sql = `delete from ${tableName} where ${idKey} = ?`
    tableName = escapeId(tableName)
    idKey = escapeId(idKey)
    new AsyncFunction("return await Promise.resolve(42);")();
    return {
        sql: sql,
        params: [id]
    }
}

