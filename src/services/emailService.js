require('dotenv').config()
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Dota 2 with us 👻" <diia0chuidit@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend) // html body

    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        let result =
            `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>Thời gian: ${dataSend.time}</div>
        <div>Bác sĩ: ${dataSend.doctorName}</div>
        <p>Xác nhận để hoàn tất thủ tục đặt lịch</p>
        <div>
        <a href =  ${dataSend.rediirectLink} target = "_blank">Click here</a>
        </div>
        
        `
    }
    if (dataSend.language === 'en') {
        let result =
            `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>Booking information:</p>
        <div>Time: ${dataSend.time}</div>
        <div>Doctor: ${dataSend.doctorName}</div>
        <p>Confirm and complete!</p>
        <div>
        <a href =  ${dataSend.rediirectLink} target = "_blank">Click here</a>
        </div>
        
        `
    }
    return result
}

module.exports = {
    sendSimpleEmail,
}