const sgMail = require('@sendgrid/mail');
//const sendgridAPIKEY = "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";
sgMail.setApiKey(process.env.sendgridAPIKEY);
sgMail.send({
    to: 'vasu242001@gmail.com',
    from: 'vasu242001@gmail.com',
    subject: 'to check this system',
    text:'this works fine Bro'
})
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vasu242001@gmail.com',
        subject: 'to check this system',
        text:`Welcome  ${name},We Hope together We will Build a String Relationship `
    })
}
const sendCancelationEmail=(email, name) => {
    sgMail.send({
        to: email,
        from: 'vasu242001@gmail.com',
        subject: 'Cancelation Email',
        text:`BYE  ${name},Hope we Builded  a Strong Relationship `
    })
}
module.exports = { sendWelcomeEmail,sendCancelationEmail };