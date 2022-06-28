import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppoinment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                // send email
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    rediirectLink: buildUrlEmail(data.doctorId, token)
                })

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        gender: data.selectedGender,
                        firstName: data.fullName
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
                            timeType: data.timeType,
                            token: token
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

let postVerifyBookAppoinment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update statusId succeeded!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }

            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postBookAppoinment, postVerifyBookAppoinment
}