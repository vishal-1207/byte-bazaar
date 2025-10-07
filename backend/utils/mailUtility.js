import nodemailer from "nodemailer";

/**
 * Creates a transporter for PRODUCTION using Brevo.
 * @private
 */
const createProductionTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_POST === 456,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Creates a transporter for DEVELOPMENT using Ethereal.
 * @private
 */
const createDevelopmentTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log(
    "Ethereal test account created. Preview emails at:",
    nodemailer.getTestMessageUrl(testAccount)
  );

  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * A generic, reusable function to send emails.
 * It automatically chooses the correct transporter based on the environment.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML body of the email.
 */

const sendMail = async (to, subject, html) => {
  try {
    let transporter;

    if (process.env.NODE_ENV === "production") {
      transporter = createProductionTransporter();
    } else {
      transporter = createDevelopmentTransporter();
    }

    const mailOptions = {
      from: `"<Zapify>" <${(process, env.EMAIL_FROM)}>}`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Email sent (dev mode), preview URL: %s",
        nodemailer.getTestMessageUrl(info)
      );
    } else {
      console.log("Email sent successfully (prod mode): ", info.response);
    }

    return info;
  } catch (error) {
    console.error("Error sending mail: ", error);
  }
};

export default sendMail;
