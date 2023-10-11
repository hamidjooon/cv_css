const fs = require('fs');
const sqlite3 = require('sqlite3');

// SQLite3 database connection (initialize your db as needed)
let dbInstance = null;

function getDatabase() {
    if (!dbInstance) {
        dbInstance = new sqlite3.Database('./database/db.sqlite', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to the database');

                // Initialize the DB
                const sqlScript = fs.readFileSync('initial.sql', 'utf8');

                dbInstance.serialize(() => {
                    dbInstance.exec(sqlScript, (err) => {
                        if (err) {
                            console.error('Error running initial queries:', err.message);
                        } else {
                            console.log('Initial queries executed successfully.');
                        }
                    });
                });
            }
        });
    }
    return dbInstance;
}

module.exports = {
    getDatabase
};