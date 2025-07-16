const mongoose = require('mongoose');

module.exports = () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_micro';
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}; 