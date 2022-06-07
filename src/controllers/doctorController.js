import doctorService from '../services/doctorService'
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) { limit = 10 }
    try {
        let doctors = await doctorService.getTopDoctorHomeService(+limit)
        return res.status(200).json(doctors)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever...'
        })
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome
}