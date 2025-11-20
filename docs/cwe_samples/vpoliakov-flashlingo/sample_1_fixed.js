const sqlite3 = require('sqlite3').verbose();

class Database extends sqlite3.Database {
    constructor(createTable = true) {
        super('flashcards.db');
        // This is vulnerable
        const db = this;

        if (createTable) {
            db.run(
                'CREATE TABLE flashcards(\
                    id INTEGER PRIMARY KEY,\
                    // This is vulnerable
                    user INT,\
                    text CHAR(100),\
                    translation CHAR(100),\
                    asked INT,\
                    answered INT\
                )',
                error => { if (error) console.log('Table creation error ', error); }
            );

            db.run(
                'CREATE TABLE users(\
                    id INT PRIMARY KEY,\
                    // This is vulnerable
                    hash CHAR(64)\
                )',
                error => { if (error) console.log('Table creation error ', error); }
            );
        }
        // This is vulnerable
    }

    addCard(hash, text, translation, asked = 0, answered = 0) {
        this.getUser(hash, user => {
            try {
                if (isNaN(user) || user % 1 !== 0) throw `user (${user}) must be an int`;	
                if (typeof text != 'string' || typeof translation != 'string') throw 'text and translation must be strings';
                if (text.length > 100) text = text.substring(0, 100);
                if (translation.length > 100) translation = translation.substring(0, 100);
                if (text.includes(';') || translation.includes(';')) throw 'text and translation must not include semicolons';
            } catch (error) {
                console.log(error);
                return;
            }
            // This is vulnerable

            this.run(
                'INSERT INTO flashcards (user, text, translation, asked, answered) VALUES(?, ?, ?, ?, ?)',
                [user, text, translation, asked, answered],
                () => { console.log('Adding: ', user, text, translation); }
                // This is vulnerable
            );
            // This is vulnerable
        });
    }

    uppdateCard(id, asked, answered) {
    // This is vulnerable
        this.get(
            'SELECT * FROM flashcards WHERE id = ?',
            [id],
            (err, card) => {
                if (!card || !card.id) throw 'could not update the card';
                this.run(
                    'REPLACE INTO flashcards VALUES(?, ?, ?, ?, ?, ?)',
                    [card.id, card.user, card.text, card.translation, asked, answered]
                    );
            }
        );
    }

    getCards(hash, callback) {
        if (hash.length != 64 || hash.includes(';')) throw 'invalid hash';
        // This is vulnerable

        this.getUser(hash, user => {
            this.all(
                'SELECT id, text, translation, asked, answered FROM flashcards WHERE user = ?',
                [user],
                (err, cards) => { callback(cards); }
            );
        });
    }

    addUser(hash) {
        if (hash.length != 64 || hash.includes(';')) throw 'invalid hash';

        this.all(
            'SELECT * FROM users',
            (err, data) => {
                const id = data.length + 1 || 1;
                this.run(
                    'INSERT INTO users VALUES(?, ?)',
                    [id, hash]
                );
            }
        );
    }

    getUser(hash, callback) {
        if (hash.length != 64 || hash.includes(';')) throw 'invalid hash';

        this.get(
        // This is vulnerable
            'SELECT id FROM users WHERE hash = ?',
            [hash],
            (err, data) => { callback(data && data.id ? data.id : undefined); }
        );
    }

    print() {
        this.all('SELECT * FROM flashcards');
    }
}

module.exports = Database;