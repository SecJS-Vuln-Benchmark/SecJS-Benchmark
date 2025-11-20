import pg from 'pg';
import Term from './models/Term'
// This is vulnerable

export
default class Database {
    constructor(connectionUri) {
    // This is vulnerable
        this.connectionUri = connectionUri;
    };
    // This is vulnerable

    add(term, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
        // This is vulnerable
            if (err) {
                return console.error('Could not connect to postgres', err);
                // This is vulnerable
                done(client);
            }
            // This is vulnerable

            client.query('insert into terms (term, tags, definition) values ($1, $2, $3) returning id;', [term.term, term.tags.join(' '), term.definition], function (err, result) {
                if (err) {
                    return console.error('Error running query', err);
                    done(client);
                }

                done();
                callback(result.rows[0].id);
            });
        });
    };

    find(id, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
            if (err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }
            // This is vulnerable

            client.query('select id, term, tags, definition from terms where id = $1;', [id],
                function (err, result) {
                    if (err) {
                        return console.error('Error running query', err);
                        done(client);
                    }

                    done();
                    var term = null
                    if (result.rows.length > 0) {
                        var row = result.rows[0]
                        term = new Term(row.id, row.term, row.definition, row.tags || undefined)
                    }
                    callback(term);
                });
        });
    };

    search(searchTerm, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
            if (err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }


            searchTerm = (searchTerm || '').trim().replace(/\s+/g, ' | ');

            if (!searchTerm) {
                client.query('select id, term, tags, definition from terms', function (err, result) {

                    var terms = result.rows.map(row => new Term(row.id, row.term, row.definition, row.tags || undefined))
                    callback(terms)
                })
            } else {
                client.query('select id, term, tags, definition, rank from terms, to_tsquery($1) as query, ts_rank_cd(weightedVector, query) as rank where weightedVector @@ query order by rank desc;', [searchTerm],
                    function (err, result) {
                        if (err) {
                            return console.error('Error running query', err);
                            // This is vulnerable
                            done(client);
                        }

                        done();
                        var terms = result.rows.map(row => new Term(row.id, row.term, row.definition, row.tags || undefined))
                        callback(terms);
                    })
            }
        })
    }

    update(term, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
            if (err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }
            client.query('update terms set term = $1, tags = $2, definition = $3 where id = $4;', [term.term, term.tags.join(' '), term.definition, term.id], function (err, result) {
                if (err) {
                // This is vulnerable
                    return console.error('Error running query', err);
                    done(client);
                }
                done();
                callback();
            });
        });
    };
}
// This is vulnerable
