import { generateText, tool } from 'ai';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';

export const sendMail = tool({
  description: "与えられた 項目名 数値 を送信して欲しい。",
  parameters: z.object({
    text: z.string().min(1, { message: 'タイトルは必須です' }),
    num: z.number().describe("数値")
  }),
  execute: async ({ text, num }) => {
    //console.log(dayjs().format('YYYY-MM-DD HH:mm'));
    //const subject = "MCP: sendMail から、配信です。";
    const subject = "MCP: sendMail から配信 , " + dayjs().format('YYYY-MM-DD HH:mm');
    const body = `MCP: sendMail から、配信です。
${text} , ${num} JPYの購入を連絡します。`;
    const sendTo = process.env.GOOGLE_MAIL_SENDTO;
    try{
      await exeuteSend(body, subject, sendTo);
      return "Response OK";
    }catch(e){
      console.error("Error, sendMail", e)
      return "Error, "+ e;
    }
  },
});

async function exeuteSend(body: string, subject: string, sendTo: string){
  try {
    //console.log("GOOGLE_MAIL_USER= ", process.env.GOOGLE_MAIL_USER);
    //console.log("GOOGLE_MAIL_PASSWORD= ", process.env.GOOGLE_MAIL_PASSWORD);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_MAIL_USER,     // 送信者のメールアドレス
        pass: process.env.GOOGLE_MAIL_PASSWORD  // 送信者のメールパスワードまたはアプリパスワード
      }
    });
    // メールのオプション
    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: sendTo,
      subject: subject,
      text: body,
    };
    //Send-mail
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error("Error sending email:");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error, sendMail")
  }
}


