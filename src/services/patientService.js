import db from '../models/index'
require('dotenv').config()


let postBookAppoinment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                    attributes: {
                        exclude: ['image']
                    }
                })
                // create booking data
                // if (user && user[0]) {
                //     await db.Booking.create({
                //         statusId: 'S1',
                //         doctorId: data.doctorId,
                //         patientId: user[0].id,
                //         date: data.date,
                //         timeType: data.timeType

                //     })
                // }
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: user
                })
            }
        } catch (e) {
            reject(e)
        }
    })

}

module.exports = {
    postBookAppoinment
}