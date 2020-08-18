const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    deviceToken: String,
    enabled: Boolean
}, {timestamps: { updatedAt: 'lastOnline'}})

module.exports = mongoose.model('Device', DeviceSchema)
