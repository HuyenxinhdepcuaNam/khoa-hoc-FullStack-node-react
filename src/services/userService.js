import bcrypt from 'bcryptjs/dist/bcrypt'
import db from '../models/index'


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                })
                if (user) {
                    let check = bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0
                        userData.message = 'Ok'
                        delete user.password
                        userData.user = user
                        // console.log(user)
                    }
                    else {
                        userData.errCode = 3
                        userData.message = 'Wrong password!'
                    }
                } else {
                    userData.errCode = 2
                    userData.message = 'User is not found!'
                }

            } else {
                userData.errCode = 1
                userData.message = 'Your email is not exist in system!'
            }
            resolve(userData)

        } catch (e) {
            reject(e)
        }
    })

}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },

                })
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers
}