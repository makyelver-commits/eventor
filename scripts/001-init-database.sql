-- Create User table
CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    resetToken TEXT,
    resetTokenExpiry DATETIME,
    profileName TEXT,
    profileImage TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create UserSettings table
CREATE TABLE IF NOT EXISTS UserSettings (
    id TEXT PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    eventColors TEXT DEFAULT '[]',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Create Event table
CREATE TABLE IF NOT EXISTS Event (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date DATETIME NOT NULL,
    time TEXT NOT NULL,
    location TEXT,
    color TEXT DEFAULT '#3B82F6',
    imageUrl TEXT,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Create Post table
CREATE TABLE IF NOT EXISTS Post (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    published INTEGER DEFAULT 0,
    authorId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);
CREATE INDEX IF NOT EXISTS idx_event_userId ON Event(userId);
CREATE INDEX IF NOT EXISTS idx_event_date ON Event(date);
CREATE INDEX IF NOT EXISTS idx_usersettings_userId ON UserSettings(userId);
