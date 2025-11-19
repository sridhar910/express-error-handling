// Centralized error handling middleware

function errorHandler(err, req, res, next) {
    console.error(err.stack);

    // If error is a Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    // If duplicate key error (e.g., unique email)
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Duplicate entry: email already exists' });
    }

    // Default to 500 server error
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;