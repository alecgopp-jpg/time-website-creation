-- Create feedback_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS feedback_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('feedback', 'research', 'media', 'other')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    telegram_sent BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- Create index for faster queries by status and date
CREATE INDEX idx_feedback_status ON feedback_messages(status);
CREATE INDEX idx_feedback_created_at ON feedback_messages(created_at DESC);
CREATE INDEX idx_feedback_category ON feedback_messages(category);