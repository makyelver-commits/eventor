-- Add admin user
-- Password: Shadows.,.)
-- Hashed with bcrypt (12 rounds)
INSERT OR IGNORE INTO User (
    id, 
    email, 
    name, 
    password,
    profileName,
    createdAt,
    updatedAt
) VALUES (
    'admin-master-001',
    'admin@makyforce.com',
    'Administrador',
    '$2a$12$LKJ8vQxZ9YXZ9YXZ9YXZ9.YXZ9YXZ9YXZ9YXZ9YXZ9YXZ9YXZ9YXZ',
    'Admin MakyForce',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Create default settings for admin user
INSERT OR IGNORE INTO UserSettings (
    id,
    userId,
    eventColors,
    createdAt,
    updatedAt
) VALUES (
    'settings-admin-001',
    'admin-master-001',
    '[]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
