const { getDatabase } = require('./singleton-db');
const bcrypt = require('bcrypt');

const db = getDatabase();

// Function to find a user by username
function findUserByUsername(username, callback) {
  const sql = 'SELECT * FROM user WHERE username = ?';
  db.get(sql, [username], (err, user) => {
   
    if (err) {
      
      callback(err, null);
      
    } else {
      callback(null, user);
    }
  });
}

function getUserInfo(userId, callback) {
  const sql = `
  SELECT 
  user.username, profile.firstName, profile.lastName
 FROM user 
 LEFT JOIN profile ON user.id = profile.userId
    WHERE user.id = ?`;

  db.get(sql, [userId], (err, userProfile) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, userProfile);
    }
  });
}

function updateUserProfile(userId, firstName, lastName, password) {
  updateName(userId, firstName, lastName);
  updatePassowrd(userId, password);
}

function updateName(userId, firstName, lastName) {
  const sql = `
    UPDATE profile
    SET
        firstName = ?,
        lastName = ?
    WHERE
        userId = ?`;

    // Execute the query with parameters
  db.run(sql, [firstName, lastName, userId], (err) => {
    if (err) {
        console.error('Error updating user profile:', err);
    } else {
        console.log('User profile updated successfully.');
    }
  });
}

function updatePassowrd(userId, password) {
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
          console.error('Error hashing password:', err);
          hashedPassword = password; //fallback plain password
      }
      const sql = `
        UPDATE user
        SET
          password = ? 
        WHERE
          id = ?`;

      db.run(sql, [hashedPassword, userId], (err) => {
        if (err) {
            console.error('Error updating user profile:', err);
        } else {
            console.log('User password updated successfully.');
        }
      });
    });
  }
}
function registerNewUser(username, password, role) {

  bcrypt.hash(password, 10, (err, hashedPassword) => {

    const sql = `
      INSERT INTO user 
      (username, password, role)
      VALUES 
      (?, ?, ?)
    `;

    if(!role) {
      role = 'ROLE_USER';
    }

    // Insert the new user into the database
    db.run(
        sql,
        [username, hashedPassword, role],
        (err) => {
            if (err) {
              console.error('Error registering user', err);
            } else {
                console.log('User registered updated successfully.');
            }
        }
    );
  });
}


module.exports = {
  findUserByUsername,
  getUserInfo,
  updateUserProfile,
  registerNewUser
};