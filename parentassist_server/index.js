require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
var port = process.env.PORT || '9000';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS
    }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database');
    }
});

app.post('/signup', async (req, res) => {
    const { name, address, email, phone, password } = req.body;

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const [existingUser] = await db.promise().query(checkEmailQuery, [email]);



    if (existingUser.length > 0) {

        return res.status(400).json({ error: 'Email already registered' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // console.log('Received data:', { name, address, email, password, phone });
    // Insert user data into 'user' table
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const userSql = 'INSERT INTO users (email, password, role,user_status,token_verification) VALUES (?, ?, "Child","INACTIVE",?)';
    db.query(userSql, [email, hashedPassword, verificationToken], (err, userResult) => {
        if (err) {
            console.error('Error inserting user data:', err);
            return res.status(500).json({ message: 'Error registering user' });
        }


        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Email Verification',
            html: `<p>Click <a href="${process.env.CLIENT_URL}/verify/${verificationToken}">here</a> to verify your email.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification email:', error);
                return res.status(500).json({ message: 'Error sending verification email' });
            } else {
                console.log('Verification email sent:', info.response);
                res.status(200).json({ message: 'Registration successful. Verification email sent.' });
            }
        });

        // Insert additional data into 'adult_child' table
        const adultChildSql = 'INSERT INTO adult_child (name, address, phone, user_id) VALUES (?, ?, ?, ?)';
        const user_id = userResult.insertId;
        db.query(adultChildSql, [name, address, phone, user_id], err => {
            if (err) {
                console.error('Error inserting adult_child data:', err);
                return res.status(500).json({ message: 'Error registering user' });
            }

            res.status(200).json({ message: 'Registration successful' });
        });
    });
});

app.post('/emailverify', async (req, res) => {
    const { token } = req.body;

    // Check if the token is valid
    // Retrieve user with the provided token from the database
    const verifyUserSql = 'UPDATE users SET user_status = "ACTIVE" WHERE token_verification = ?';
    db.query(verifyUserSql, [token], (err, result) => {
        if (err) {
            console.error('Error verifying user:', err);
            return res.status(500).json({ success: false });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false });
        }
    });
});

app.post('/login', async (req, res) => {

    const { email, password } = req.body;
    // return res.status(200).json({message:"dfsd"})


    try {
        const selectQuery = 'SELECT * FROM users WHERE email = ? ';
        const [rows] = await db.promise().query(selectQuery, [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }


        const user = rows[0];
        //   const hashedPassword = await bcrypt.hash(password, 10);
        //   console.log({hashedPassword})
        const isPasswordValid = await bcrypt.compare(password, user.password);
        //   console.log(isPasswordValid)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        } else {
            const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({ data: token, role: user.role, email: user.email, message: 'Login successful' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }

});

app.post('/google-signup', async (req, res) => {
    const { gname, gemail } = req.body;

    try {
        // Check if the user exists in the database based on their email
        const selectQuery = 'SELECT * FROM users WHERE email = ? ';
        const [rows] = await db.promise().query(selectQuery, [gemail]);

        if (rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // If user doesn't exist, insert them into the database
        const userSql = 'INSERT INTO users (email, role,user_status) VALUES (?,"Child","ACTIVE")';
        db.query(userSql, [gemail], async (err, userResult) => {
            if (err) {
                console.error('Error inserting user data:', err);
                return res.status(500).json({ message: 'Error registering user' });
            }

            // Insert additional data into 'adult_child' table
            const adultChildSql = 'INSERT INTO adult_child (name, user_id) VALUES (?, ?)';
            const user_id = userResult.insertId;
            db.query(adultChildSql, [gname, user_id]);

            console.log('Registration successful');
            // Create a JWT token with user's information
            const token = jwt.sign({ userId: user_id, email: gemail }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ data: token, email: gemail });
        });
    } catch (error) {
        console.error('Google Sign-In error:', error);
        res.status(500).json({ error: 'Error during Google Sign-In' });
    }
});

app.post('/google-signin', async (req, res) => {
    const { gname, gemail } = req.body;

    try {
        // Check if the user exists in the database based on their email
        const selectQuery = 'SELECT * FROM users WHERE email = ? ';
        const [rows] = await db.promise().query(selectQuery, [gemail]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'User Not Found' });
        }

        const user = rows[0];

        const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ data: token, role: user.role, email: user.email });
    } catch (error) {
        console.error('Google Sign-In error:', error);
        res.status(500).json({ error: 'Error during Google Sign-In' });
    }
});



app.get('/users', (req, res) => {
    const query = 'SELECT user_id, email, user_status FROM users WHERE user_id > 1';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(result);
        }
    });
});

app.listen(port, () => {
    console.log('listening');
})