const { model } = require('mongoose')
const UsersSchema = require('../schemas/userSchema')

const Users = model('users', UsersSchema)

module.exports = Users