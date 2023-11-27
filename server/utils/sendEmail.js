import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import Verification from "../models/emailVerification.js";
import { hashString } from "./index.js";

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(success);
//   }
// });

export const sendVerificationEmail = async (user, res, type = "users") => {
  const { _id, email } = user;

  const token = _id + uuidv4();
  const link = APP_URL + `/${type}/verify/` + _id + "/" + token;
  //   mail options
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    // html: `<p>Verify your email address<br/> <p>This link <b>expires in 1 hour</b></p><a href=${link}>Verify</a>`,
    html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;">
        Please click on the verification link below to confirm your email.
        <br>
        <p style="font-size: 18px;">This link <b>expires in 1 hour</b></p>
         <br>
        <a href=${link} style="color: #fff; padding: 10px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px; ">Verify Email</a>.
    </p>`,
  };

  try {
    const hashedToken = await hashString(token);

    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    if (newVerifiedEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message:
              "Verification email has been sent to your account. Check your email for further instructions.",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: "Something went wrong" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};
