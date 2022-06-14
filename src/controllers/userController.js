import userService from '../services/userService'

let handleLogin = async (req, res) => {
    let email = req.body.email
    // console.log('yourEmail:', email)
    let password = req.body.password
    // console.log('yourEmail:', password)

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input!'
        })
    }
    let userData = await userService.handleUserLogin(email, password)
    // check email exist
    // compare password
    // return userInfor, access token: jwt-json web token
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData ? userData : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id
    // console.log('req.type', id)

    if (!id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing input!',
        })
    }
    let users = await userService.getAllUsers(id)

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}
let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    // console.log(message)
    return res.status(200).json(message)

}
let handleEditUser = async (req, res) => {
    let data = req.body
    let message = await userService.updateUserData(data)
    return res.status(200).json(message)
}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing input!'
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type)
        // console.log('check', data)
        return res.status(200).json(data)
    } catch (e) {

        return res.status(200).json({
            errCode: -1,
            errMessage: "Can not reached from sever!"
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,

    getAllCode: getAllCode,


}