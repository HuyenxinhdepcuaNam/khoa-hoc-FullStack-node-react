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
        html: // html body
            `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>Thời gian: ${dataSend.time}</div>
        <div>Bác sĩ: ${dataSend.doctorName}</div>
        <p>Xác nhận để hoàn tất thủ tục đặt lịch</p>
        <div>
        <a href =  ${dataSend.rediirectLink} target = "_blank">Click here</a>
        </div>
        
        `,
    });
}

module.exports = {
    sendSimpleEmail,
}