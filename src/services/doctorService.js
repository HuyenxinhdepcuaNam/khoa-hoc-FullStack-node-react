import db from '../models/index'
import _, { reject } from 'lodash'
require('dotenv').config()

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE



let getTopDoctorHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users,
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['image', 'password']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML ||
                !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }
                if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown
                        doctorMarkdown.description = inputData.description

                        await doctorMarkdown.save()
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentHTML', 'contentMarkdown', 'description']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },

                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) { data = {} }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const bulkCreateSchedulle = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required input!'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })
                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime()
                        return item
                    })

                }

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date
                })
                console.log('check toCreate', toCreate)
                if (toCreate && toCreate.length > 0) {
                    return await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date }
                })
                if (!dataSchedule) { data = [] }
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedulle,
    getScheduleByDate,
}