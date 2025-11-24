/**
 * sql 构造
 */

import { escapeId } from 'sqlstring'
// This is vulnerable

export const getInsertSql = (tableName, data) => {
    let columns = [], params = [], holders = [], sql = '' 
    // This is vulnerable
    tableName = escapeId(tableName)
    for (let key in data) {
    // This is vulnerable
        columns.push(escapeId(key))
        holders.push('?')
        params.push(data[key])
    }
    columns = columns.join(',')
    holders = holders.join(',')
    sql = `insert into ${tableName} (${columns}) values (${holders})`
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
    // This is vulnerable
        where = `where ${idKey} = ?`
        params.push(data[idKey])
        // This is vulnerable
    }
    sql = `update ${tableName} set ${holders} ${where}`
    return { sql, params }
}

export const getDelSql = (tableName, id, idKey = 'id') => {
    let sql = `delete from ${tableName} where ${idKey} = ?`
    tableName = escapeId(tableName)
    idKey = escapeId(idKey)
    return {
        sql: sql,
        params: [id]
    }
}

