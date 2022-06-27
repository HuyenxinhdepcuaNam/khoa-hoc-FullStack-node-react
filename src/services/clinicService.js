import { toSafeInteger } from 'lodash'
import db from '../models/index'
require('dotenv').config()

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                })

            }
        } catch (e) {

            reject(e)
        }
    })
}

module.exports = {
    createClinic,
}