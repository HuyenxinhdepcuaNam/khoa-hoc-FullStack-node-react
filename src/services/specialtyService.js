import { toSafeInteger } from 'lodash'
import db from '../models/index'
require('dotenv').config()

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input!'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',

                })

            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSpecialty,
}