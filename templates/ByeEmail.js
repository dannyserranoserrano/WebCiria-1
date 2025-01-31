const nodemailer = require("nodemailer");

const userMail = process.env.MAIL_USER
const pass = process.env.MAIL_PSSWD

const transport = nodemailer.createTransport({ // Con esto creo la conexión SMTP y le paso las credenciales del correo remitente
    service: "Gmail",
    pool: true,
    host: 'smtp.gmail.com', // Gmail as mail client
    port: 465,
    secure: true, // use SSL

    auth: {
        user: userMail,
        pass: pass,
    },
    tls: {
        rejectUnauthorized: false
    },
});


// Aquí creo el correo de bienvenida que llamaré la función una vez creado el usuario

module.exports.sendByeEmail = (name,surname,city,email) => {
    console.log("Send Mail Delete User");
    transport.sendMail({
        from: userMail,
        to: email,
        subject: "¡Hasta Siempre Amig@!!!",
        html: `<h1>¡Has borrado tu cuenta!</h1>
        <h2>¡¡Hola ${name} ${surname}!!! </h2>
        <p>Tus datos de acceso así como tu cuenta, han sido borrados satisfactoriamente:</p>
        <p><b>Nombre y Apellidos:</b> ${name} ${surname}</p>
        <p><b>Ciudad de Origen:</b> ${city}</p>
        <p><b>Correo electrónico :</b> ${email}</p>
        <p>Puedes volver a registrarte si asi lo deseas!!!</p>
        <p>Gracias por haber estado con nosotros, siempre serás bienvenido a Ciria! </p>
        </div>`,
    }).catch(err => console.log(err));
};



// --- donde USER_MAIL y PASS_MAIL son datos guardados en tu archivo .env y es tu correo con tu contraseña --- ojo, está hecho para gmail --- 