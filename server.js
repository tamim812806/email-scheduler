const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const getEmailsData = () => {
    try {
        const data = fs.readFileSync('data/emails.json');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const saveEmailsData = (data) => {
    fs.writeFileSync('data/emails.json', JSON.stringify(data, null, 2));
};

// API to schedule email
app.post('/send-email', (req, res) => {
    const { email, subject, message, scheduleTime } = req.body;

    const emailsData = getEmailsData();
    const emailData = { email, subject, message, scheduleTime, status: 'pending' };
    emailsData.push(emailData);
    saveEmailsData(emailsData);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: message
    };

    // Simulate sending email after scheduled time
    setTimeout(() => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(error.toString());
            }

            // Update email status to sent in JSON file
            const emailsData = getEmailsData();
            const updatedData = emailsData.map((data) => {
                if (data.email === email && data.scheduleTime === scheduleTime) {
                    data.status = 'sent';
                }
                return data;
            });
            saveEmailsData(updatedData);

            res.status(200).send('Email sent: ' + info.response);
        });
    }, new Date(scheduleTime) - new Date());

    res.status(200).send('Email scheduled.');
});

// API to get scheduled emails
app.get('/scheduled-emails', (req, res) => {
    const emailsData = getEmailsData();
    res.status(200).json(emailsData);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
