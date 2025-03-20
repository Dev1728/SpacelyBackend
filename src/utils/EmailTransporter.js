import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:"dj64360@gmail.com", 
            pass:"exkj mpvu ffyg tcbj", 
        },
    });

    const mailOptions = {
        from:"dj64360@gmail.com",
        to: email,
        subject: subject,
        html: message,
    };

    await transporter.sendMail(mailOptions);
};

export {sendEmail};
