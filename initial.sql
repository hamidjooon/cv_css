--  User table
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    active BOOLEAN
);

-- insert default admin user
INSERT INTO user (username, password, role, active)
    SELECT 'admin', '$2b$10$IEsZtdkX4I.ZdpAa5hsPBuQk.ywLepZKKcKj.QkuKBWs2qYHROz6K', 'ROLE_ADMIN', true
        WHERE NOT EXISTS (SELECT 1 FROM user WHERE username = 'admin');

--  Profile table
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    firstName TEXT,
    lastName TEXT,
    FOREIGN KEY (userId) REFERENCES user(id)
);
INSERT INTO profile (userId, firstName)
    SELECT us.id, 'ADMINISTRATOR' FROM user us WHERE us.username = 'admin' AND 0 = (SELECT count(*) FROM user ut JOIN profile ON ut.id = profile.userId and ut.id = us.id);

-- Work table
CREATE TABLE IF NOT EXISTS work (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    company TEXT,
    position TEXT,
    description TEXT,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (userId) REFERENCES user(id)
);
-- Education table
CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    institution TEXT,
    startDate DATE,
    endDate DATE,
    degree TEXT,
    major TEXT,
    FOREIGN KEY (userId) REFERENCES user(id)
);
-- Certificate table
CREATE TABLE IF NOT EXISTS certificate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT,
    dateOfAchievement DATE,
    FOREIGN KEY (userId) REFERENCES user(id)
);