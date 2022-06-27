import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body)
        res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error form server...'
        })
    }
}

module.exports = {
    createClinic,
}
