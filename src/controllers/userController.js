import userService from '../services/userService'

let handleLogin = async (req, res) => {
    let email = req.body.email
    console.log('yourEmail:', email)
    let password = req.body.password
    console.log('yourEmail:', password)

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
module.exports = {
    handleLogin: handleLogin
}