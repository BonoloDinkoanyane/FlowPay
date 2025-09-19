import { MailtrapClient } from 'mailtrap'

export const emailClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN!, //exclamation mark basically tells ts that it has a defined data type
});