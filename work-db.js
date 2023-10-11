const { getDatabase } = require('./singleton-db');

const db = getDatabase();

function getWorkList(userId) {
    const sql = `
        SELECT 
            id, company, position, description, startDate, endDate 
        FROM 
            work 
        WHERE userId = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [userId], (err, workList) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(workList);
                }
            });
        });
}

function addNewWork(userId, company, position, description, startDate, endDate) {
    const sql = `
        INSERT INTO work 
            (userId, company, position, description, startDate, endDate)
        VALUES 
            (?, ?, ?, ?, ?, ?)
        `;

      // Insert the new user into the database
      db.run(
          sql,
          [userId, company, position, description, startDate, endDate],
          (err) => {
              if (err) {
                console.error('Error adding work', err);
              } else {
                  console.log('Work added successfully.');
              }
          }
      );

}

function removeWork(userId, id) {
    const sql = `
        DELETE FROM 
            work 
        WHERE 
            userId = ? AND id = ?
        `;

      // Insert the new user into the database
      db.run(
          sql,
          [userId, id],
          (err) => {
              if (err) {
                console.error('Error deleting work', err);
              } else {
                  console.log('Work deleted successfully.', id);
              }
          }
      );
}

module.exports = {
    getWorkList,
    addNewWork,
    removeWork
}