require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const format = require('date-fns/format');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { log } = require("console");


const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
var port = process.env.PORT || '9000';

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
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

        if (user.user_status === 'DEACTIVE') {
            return res.status(401).json({ error: 'Your Account is Deactivated By Admin' });
        }

        //   const hashedPassword = await bcrypt.hash(password, 10);
        //   console.log({hashedPassword})
        const isPasswordValid = await bcrypt.compare(password, user.password);
        //   console.log(isPasswordValid)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        } else {
            const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({ data: token, userId: user.user_id, role: user.role, email: user.email, message: 'Login successful' });
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
            res.json({ data: token, userId: user_id, email: gemail });
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


        if (user.user_status === 'DEACTIVE') {
            return res.status(401).json({ error: 'Your Account is Deactivated By Admin' });
        }

        const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ data: token, userId: user.user_id, role: user.role, email: user.email });
    } catch (error) {
        console.error('Google Sign-In error:', error);
        res.status(500).json({ error: 'Error during Google Sign-In' });
    }
});

//Forgot Password API endpoint
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const selectQuery = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.promise().query(selectQuery, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Generate reset token and save it in the user's record
        const resetToken = crypto.randomBytes(20).toString('hex');
        const updateUserTokenQuery = 'UPDATE users SET reset_token = ? WHERE email = ?';
        await db.promise().query(updateUserTokenQuery, [resetToken, email]);

        // Send reset link to user's email
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending reset email:', error);
                return res.status(500).json({ message: 'Error sending reset email' });
            } else {
                console.log('Password reset email sent:', info.response);
                res.status(200).json({ message: 'Password reset link sent to your email' });
            }
        });
    } catch (error) {
        console.error('Forgot Password error:', error);
        res.status(500).json({ error: 'Forgot Password failed' });
    }
});

//Forgot-Pass user link API endpoint
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const selectQuery = 'SELECT * FROM users WHERE reset_token = ?';
        const [rows] = await db.promise().query(selectQuery, [token]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid reset token' });
        }

        const user = rows[0];
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update user's password and remove reset token
        const updateUserQuery = 'UPDATE users SET password = ?, reset_token = NULL WHERE user_id = ?';
        await db.promise().query(updateUserQuery, [hashedPassword, user.user_id]);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Password Reset error:', error);
        res.status(500).json({ error: 'Password Reset failed' });
    }
});


//Parent-Register API endpoint
app.post('/parent-register', async (req, res) => {
    try {
        const { name, address, gender, age, email, phone, user_child_id } = req.body;
        const password = generateRandomPassword();

        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        const [existingUser] = await db.promise().query(checkEmailQuery, [email]);

        if (existingUser.length > 0) {

            return res.status(400).json({ error: 'Email already registered' });
        }

        // Retrieve the child's ID
        const getChildIdQuery = 'SELECT adult_child_id FROM adult_child WHERE user_id = ?';
        const [childResult] = await db.promise().query(getChildIdQuery, [user_child_id]);

        if (childResult.length === 0) {
            return res.status(400).json({ error: 'Child not found' });
        }

        const child_id = childResult[0].adult_child_id;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userSql = 'INSERT INTO users (email, password, role,user_status) VALUES (?, ?, "Parent","ACTIVE")';
        db.query(userSql, [email, hashedPassword], (err, userResult) => {
            if (err) {
                console.error('Error inserting user data:', err);
                return res.status(500).json({ message: 'Error registering user' });
            }

            const user_id = userResult.insertId;

            // Insert the parent data into the 'parents' table
            const parentSql = 'INSERT INTO parents (name, age, address, phone, user_id, Gender, adult_child_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(parentSql, [name, age, address, phone, user_id, gender, child_id], (parentErr) => {
                if (parentErr) {
                    console.error('Error inserting parent data:', parentErr);
                    return res.status(500).json({ message: 'Error registering user' });
                }

                res.status(200).json({ message: 'Registration successful' });
            });

            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: 'Welcome to ParentAssist',
                html: `<p>Hello ${name},</p> <br>
                <p>Welcome to ParentAssist! Your account has been created, and we're excited to have you on board.</p> <br>
                <p>ParentAssist is an application designed to streamline communication and organization for senior parents.</p><br>
                <p>Your registered email: ${email}</p><br>
                <p>Your password: ${password}</p><br>
                <p>We're here to support you every step of the way. If you have any questions or need assistance, feel free to reach out to our support team.</p><br>
                <p>Thank you for choosing ParentAssist!</p><br>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending verification email:', error);
                    return res.status(500).json({ message: 'Error sending verification email' });
                } else {
                    console.log('Verification email sent:', info.response);
                    res.status(200).json({ message: 'Registration successful. Email sent with details.' });
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});

//Doctor-Register API endpoint
app.post('/doctor-register', async (req, res) => {
    try {
        const { name, email, specialization, hospital, phone, gender, user_child_id } = req.body;
        const password = generateRandomPassword();

        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        const [existingUser] = await db.promise().query(checkEmailQuery, [email]);

        if (existingUser.length > 0) {

            return res.status(400).json({ error: 'Email already registered' });
        }

        // // Retrieve the child's ID
        // const getChildIdQuery = 'SELECT adult_child_id FROM adult_child WHERE user_id = ?';
        // const [childResult] = await db.promise().query(getChildIdQuery, [user_child_id]);

        // if (childResult.length === 0) {
        //     return res.status(400).json({ error: 'Child not found' });
        // }

        // const child_id = childResult[0].adult_child_id;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userSql = 'INSERT INTO users (email, password, role,user_status) VALUES (?, ?, "Doctor","ACTIVE")';
        db.query(userSql, [email, hashedPassword], (err, userResult) => {
            if (err) {
                console.error('Error inserting user data:', err);
                return res.status(500).json({ message: 'Error registering user' });
            }

            const user_id = userResult.insertId;

            // Insert the parent data into the 'parents' table
            const doctorSql = 'INSERT INTO doctors (name, phone, specialization, hospital, user_id) VALUES (?, ?, ?, ?, ?)';
            db.query(doctorSql, [name, phone, specialization, hospital, user_id], (doctorErr, doctorResult) => {
                if (doctorErr) {
                    console.error('Error inserting parent data:', parentErr);
                    return res.status(500).json({ message: 'Error registering user' });
                }

                // const doctor_id = doctorResult.insertId;

                // const updateParentSql = 'UPDATE parents SET doctor_id = ? WHERE Gender = ?';
                // db.query(updateParentSql, [doctor_id, gender], (updateErr) => {
                //     if (updateErr) {
                //         console.error('Error updating parent data:', updateErr);
                //         return res.status(500).json({ message: 'Error updating parent data' });
                //     }

                res.status(200).json({ message: 'Registration successful' });
                // });
            });



            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: 'Welcome to ParentAssist',
                html: `<p>Hello Dr. ${name},</p> <br>
                <p>Welcome to ParentAssist! Your account has been created, and we're excited to have you on board.</p> <br>
                <p>ParentAssist is an application designed to streamline communication and organization for senior parents.</p><br>
                <p>Your registered email: ${email}</p><br>
                <p>Your password: ${password}</p><br>
                <p>We're here to support you every step of the way. If you have any questions or need assistance, feel free to reach out to our support team.</p><br>
                <p>Thank you for choosing ParentAssist!</p><br>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending verification email:', error);
                    return res.status(500).json({ message: 'Error sending verification email' });
                } else {
                    console.log('Verification email sent:', info.response);
                    res.status(200).json({ message: 'Registration successful. Email sent with details.' });
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});


app.get('/users', (req, res) => {
    const query = 'SELECT user_id, email, role, user_status FROM users WHERE user_id > 1';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(result);
        }
    });
});

// Admin User Details View API endpoint
app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // First, query the users table to get the user's role and email
        const getUserDetailsQuery = 'SELECT role, email, user_status FROM users WHERE user_id = ?';
        db.query(getUserDetailsQuery, [userId], (userErr, userResult) => {
            if (userErr) {
                console.error('Error fetching user details: ', userErr);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (userResult.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { role, email, user_status } = userResult[0];

            // Depending on the user's role, fetch details from the corresponding table
            let userDetailsQuery;

            if (role === 'Parent') {
                userDetailsQuery = 'SELECT * FROM parents WHERE user_id = ?';
            } else if (role === 'Doctor') {
                userDetailsQuery = 'SELECT * FROM doctors WHERE user_id = ?';
            } else if (role === 'Child') {
                userDetailsQuery = 'SELECT * FROM adult_child WHERE user_id = ?';
            }

            // Fetch user details from the respective table
            db.query(userDetailsQuery, [userId], (err, result) => {
                if (err) {
                    console.error(`Error fetching ${role} details: `, err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (result.length === 0) {
                    return res.status(404).json({ error: `${role} details not found` });
                }

                const userDetails = result[0];

                // Combine user role, email, and specific details
                const combinedDetails = {
                    role,
                    email,
                    user_status,
                    ...userDetails,
                };

                res.status(200).json(combinedDetails);
            });
        });
    } catch (error) {
        console.error('Error fetching user details: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Admin Deactive API endpoint
app.post('/deactivateUser/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Query the database to get user details based on userId and user role
        const userQuery = 'SELECT u.email, u.role, p.name AS parent_name, d.name AS doctor_name, ac.name AS adult_child_name FROM users u LEFT JOIN parents p ON u.user_id = p.user_id LEFT JOIN doctors d ON u.user_id = d.user_id LEFT JOIN adult_child ac ON u.user_id = ac.user_id WHERE u.user_id = ?';
        const [userResult] = await db.promise().query(userQuery, [userId]);
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult[0];

        // Update the user_status to 'Deactive' in the users table
        const updateQuery = 'UPDATE users SET user_status = ? WHERE user_id = ?';
        await db.promise().query(updateQuery, ['DEACTIVE', userId]);

        // Send an email to inform the user about deactivation
        const mailOptions = {
            from: process.env.GMAIL, // Replace with your email address
            to: user.email,
            subject: 'Account Deactivation',
            text: `Hello ${user.role === 'Parent' ? user.parent_name : (user.role === 'Doctor' ? user.doctor_name : user.adult_child_name)},
            \n\nYour account has been deactivated. If you believe this is a mistake, please contact us.\n\nBest regards, ParentAssist`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending deactivation email:', error);
            } else {
                console.log('Deactivation email sent:', info.response);
            }
        });

        // Respond with a success message
        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating user: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Active User API endpoint
app.post('/activateUser/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Query the database to get user details based on userId and user role
        const userQuery = 'SELECT u.email, u.role, p.name AS parent_name, d.name AS doctor_name, ac.name AS adult_child_name FROM users u LEFT JOIN parents p ON u.user_id = p.user_id LEFT JOIN doctors d ON u.user_id = d.user_id LEFT JOIN adult_child ac ON u.user_id = ac.user_id WHERE u.user_id = ?';
        const [userResult] = await db.promise().query(userQuery, [userId]);
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult[0];

        // Update the user_status to 'Deactive' in the users table
        const updateQuery = 'UPDATE users SET user_status = ? WHERE user_id = ?';
        await db.promise().query(updateQuery, ['ACTIVE', userId]);

        // Send an email to inform the user about deactivation
        const mailOptions = {
            from: process.env.GMAIL, // Replace with your email address
            to: user.email,
            subject: 'Account Activation',
            text: `Hello ${user.role === 'Parent' ? user.parent_name : (user.role === 'Doctor' ? user.doctor_name : user.adult_child_name)},
            \n\nYour account has been Activated. We're determined for your better life..\n\nBest regards, ParentAssist`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending activation email:', error);
            } else {
                console.log('Activation email sent:', info.response);
            }
        });

        // Respond with a success message
        res.json({ message: 'User Activated successfully' });
    } catch (error) {
        console.error('Error Activating user: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Child Profile GetData API Endpoint

app.get('/getUserData', (req, res) => {
    const { user_child_id } = req.query;

    // Query the database to fetch user data by username
    const query = 'SELECT name, address, phone FROM adult_child WHERE user_id = ?';

    db.query(query, [user_child_id], (err, result) => {
        if (err) {
            console.error('Error fetching user data from database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                const userData = result[0];
                res.json(userData);
            }
        }
    });
});

//Child Profile Update API Endpoint

app.put('/Childprofileupdate', (req, res) => {
    const { name, address, phone, user_child_id } = req.body;

    const updateQuery = 'UPDATE adult_child SET name=?, address=?, phone=? WHERE user_id=?';

    db.query(updateQuery, [name, address, phone, user_child_id], (err, result) => {
        if (err) {
            console.error('Error updating child profile:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Profile Update Successfully' });
        }
    });
});

//Parent Profile GetData API Endpoint
app.get('/getParentData', (req, res) => {
    const { user_child_id } = req.query;

    // Query the database to fetch user data by username
    const query = 'SELECT name, age, address, phone FROM parents WHERE user_id = ?';

    db.query(query, [user_child_id], (err, result) => {
        if (err) {
            console.error('Error fetching user data from database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                const userData = result[0];
                res.json(userData);
            }
        }
    });
});

//Parent Profile Update API Endpoint

app.put('/Parentprofileupdate', (req, res) => {
    const { name, age, address, phone, user_child_id } = req.body;

    const updateQuery = 'UPDATE parents SET name=?, age=?, address=?, phone=? WHERE user_id=?';

    db.query(updateQuery, [name, age, address, phone, user_child_id], (err, result) => {
        if (err) {
            console.error('Error updating child profile:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Profile Update Successfully' });
        }
    });
});

//Doctor Profile GetData API Endpoint
app.get('/getDoctorData', (req, res) => {
    const { user_child_id } = req.query;

    // Query the database to fetch user data by username
    const query = 'SELECT name, phone, specialization, hospital FROM doctors WHERE user_id = ?';

    db.query(query, [user_child_id], (err, result) => {
        if (err) {
            console.error('Error fetching user data from database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                const userData = result[0];
                res.json(userData);
            }
        }
    });
});

//Doctor Profile Update API Endpoint

app.put('/Doctorprofileupdate', (req, res) => {
    const { name, specialization, hospital, phone, user_child_id } = req.body;

    const updateQuery = 'UPDATE doctors SET name=?, phone=?, specialization=?, hospital=? WHERE user_id=?';

    db.query(updateQuery, [name, phone, specialization, hospital, user_child_id], (err, result) => {
        if (err) {
            console.error('Error updating child profile:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Profile Update Successfully' });
        }
    });
});

//Profile Password Update API Endpoint

app.put('/ProfilePassUpdate', async (req, res) => {
    const { password, user_child_id } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updateQuery = 'UPDATE users SET password=? WHERE user_id=?';

    db.query(updateQuery, [hashedPassword, user_child_id], (err, result) => {
        if (err) {
            console.error('Error updating child profile:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Password Update Successfully' });
        }
    });
});

// Get Parent Data for ChildView API Endpoint
app.get('/getParentViewData', async (req, res) => {
    try {
        const { user_child_id } = req.query;

        // Retrieve the child's ID
        const getChildIdQuery = 'SELECT adult_child_id FROM adult_child WHERE user_id = ?';
        const [childResult] = await db.promise().query(getChildIdQuery, [user_child_id]);

        if (childResult.length === 0) {
            return res.status(400).json({ error: 'Child not found' });
        }

        const child_id = childResult[0].adult_child_id;


        // Select the parent data from the 'parents' table
        const selectParentSql = 'SELECT name, age, phone FROM parents WHERE adult_child_id = ?'; // Add conditions as needed
        db.query(selectParentSql, [child_id], (selectErr, results) => {
            if (selectErr) {
                console.error('Error selecting parent data:', selectErr);
                return res.status(500).json({ message: 'Error retrieving parent data' });
            }

            // Check if any results were found
            if (results.length === 0) {
                return res.status(404).json({ message: 'Parent data not found' });
            }

            // const parentData = results[0]; // Assuming there's only one matching record
            res.status(200).json({ results });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});

// Doctors List API endpoint

app.get("/doctorslist", (req, res) => {
    const query = "SELECT * FROM doctors";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching doctors: ", err);
            return res.status(500).json({ error: "Error fetching doctors" });
        }

        res.json(results);
    });
});

//Doctors Details for Booking API endpoint
app.get("/doctorslist/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    const query = "SELECT * FROM doctors WHERE doctor_id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching doctor details: ", err);
            return res.status(500).json({ error: "Error fetching doctor details" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        res.json(results[0]);
    });
});

//Doctor Appointment Booking API endpoint
app.post("/doctorbooking", async (req, res) => {
    const { selectedDate, gender, time, doctorid } = req.body;
    //console.log('selected date', selectedDate,'gender:',gender,"time:",time,"doctorId:",doctorid );
    //console.log(time);

    // Fetch the count of appointments for the same doctor on the same date
    const countAppointmentsQuery = "SELECT COUNT(*) AS appointmentCount FROM doctor_booking WHERE doctor_id = ? AND date = ?";
    db.query(countAppointmentsQuery, [doctorid, selectedDate], (countErr, countResults) => {
        if (countErr) {
            console.error("Error counting appointments: ", countErr);
            return res.status(500).json({ error: "Error counting appointments" });
        }

        const appointmentCount = countResults[0].appointmentCount;

        if (appointmentCount >= 20) {
            return res.status(400).json({ error: "Doctor's appointments are fully booked for this date" });
        }

        // Generate the token as the next available number
        const token = appointmentCount + 1;

        //const selectedTime = `${time}:00`;

        // const appointmentTime = calculateAppointmentTime(appointmentCount);

        // Fetch parent_id and adult_child_id based on doctor_id
        const fetchParentQuery = "SELECT parent_id, adult_child_id FROM parents WHERE Gender = ?";
        db.query(fetchParentQuery, [gender], (fetchErr, fetchResults) => {
            if (fetchErr) {
                console.error("Error fetching parent data: ", fetchErr);
                return res.status(500).json({ error: "Error fetching parent data" });
            }

            if (fetchResults.length === 0) {
                return res.status(404).json({ error: "Parent data not found for the given doctor_id" });
            }

            const { parent_id, adult_child_id } = fetchResults[0];

            const checkExistingAppointmentQuery = "SELECT COUNT(*) AS existingAppointmentCount FROM doctor_booking WHERE doctor_id = ? AND date = ? AND parent_id = ?";
            db.query(checkExistingAppointmentQuery, [doctorid, selectedDate, parent_id], (checkErr, checkResults) => {
                if (checkErr) {
                    console.error("Error checking existing appointment: ", checkErr);
                    return res.status(500).json({ error: "Error checking existing appointment" });
                }

                const existingAppointmentCount = checkResults[0].existingAppointmentCount;

                if (existingAppointmentCount > 0) {
                    return res.status(400).json({ error: "You already have an appointment with this doctor on the same date" });
                }

                const checkExistingAppointmentTimeQuery = `SELECT COUNT(*) AS existingAppointmenttimeCount 
                    FROM doctor_booking 
                    WHERE date = ? AND time = ? AND parent_id = ?`;

                db.query(checkExistingAppointmentTimeQuery, [selectedDate, time, parent_id], (checkErr, checkResults) => {
                    if (checkErr) {
                        console.error("Error checking existing appointment: ", checkErr);
                        return res.status(500).json({ error: "Error checking existing appointment" });
                    }

                    const existingAppointmenttimeCount = checkResults[0].existingAppointmenttimeCount;

                    if (existingAppointmenttimeCount > 0) {
                        return res.status(400).json({ error: "You already have an appointment at the same date and time" });
                    }


                    const bookedTimeSlotsQuery = "SELECT time FROM doctor_booking WHERE doctor_id = ? AND date = ?";
                    db.query(bookedTimeSlotsQuery, [doctorid, selectedDate], (err, results) => {
                        if (err) {
                            console.error("Error fetching booked time slots: ", err);
                            return res.status(500).json({ error: "Error fetching booked time slots" });
                        }

                        const bookedTimeSlots = results.map((result) => {
                            // Extract hour and minute components and format them as 'HH:mm'
                            const timeComponents = result.time.split(':');
                            return `${timeComponents[0]}:${timeComponents[1]}`;
                        });
                        //console.log(bookedTimeSlots);
                        const availableTimeSlots = calculateAvailableTimeSlots(selectedDate).filter((slot) => !bookedTimeSlots.includes(slot));
                        //console.log("Available Time Slots:", availableTimeSlots);


                        if (availableTimeSlots.includes(time)) {
                            // Time slot is available, proceed with booking
                            const appointmentTime = time; // You can customize this as needed


                            // Insert the booking record into the database
                            const bookingDoctorQuery = "INSERT INTO doctor_booking (date, time, doctor_id, parent_id, adult_child_id) VALUES (?, ?, ?, ?, ?)";
                            db.query(bookingDoctorQuery, [selectedDate, appointmentTime, doctorid, parent_id, adult_child_id], (bookingErr) => {
                                if (bookingErr) {
                                    console.error("Error creating booking_doctor record: ", bookingErr);
                                    return res.status(500).json({ error: "Error creating booking_doctor record" });
                                }

                                res.json({ message: "Appointment Booked successfully", token, appointmentTime });
                            });
                        } else {
                            // Time slot is not available, return a list of available time slots
                            res.status(400).json({ error_code: 3445, error_message: "Selected time slot is not available", availableTimeSlots });
                        }
                    });
                });
            });
        });
    });
});

// Doctor View Parents API endpoint
app.get("/DoctorViewParents", (req, res) => {
    const userId = req.query.userId; // Extract user ID from query parameters

    // First, retrieve the doctor_id associated with the user_id
    const doctorIdQuery = `SELECT doctor_id FROM doctors WHERE user_id = ?`;
    db.query(doctorIdQuery, [userId], (err, doctorIdResult) => {
        if (err) {
            console.error("Error fetching doctor_id: ", err);
            return res.status(500).json({ error: "Error fetching doctor data" });
        }

        // Check if a doctor with the specified user_id exists
        if (doctorIdResult.length === 0) {
            // No doctor found with the specified user_id
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorIdResult[0].doctor_id; // Extract the doctor_id

        //   console.log(doctorId);

        const query = `SELECT DISTINCT parent_id FROM doctor_booking WHERE doctor_id = ?`;
        db.query(query, [doctorId], (err, parentIds) => {
            if (err) {
                console.error("Error fetching parent data: ", err);
                return res.status(500).json({ error: "Error fetching parent data" });
            }

            // Extract the parent_ids from the results
            const parentIdsArray = parentIds.map((result) => result.parent_id);

            // Now, use the extracted parent_ids to fetch parent data from the parent table
            const parentQuery = `SELECT * FROM parents WHERE parent_id IN (?)`;
            db.query(parentQuery, [parentIdsArray], (err, parentResults) => {
                if (err) {
                    console.error("Error fetching parent data: ", err);
                    return res.status(500).json({ error: "Error fetching parent data" });
                }

                res.json(parentResults);
            });
        });
    });
});

// Todays Appointment APPI endpoint
app.get("/DoctorViewAppointments", (req, res) => {
    const { userId, date } = req.query; // Extract doctorId and date from query parameters

    // Format the current date in the format YYYY-MM-DD
    const currentDate = format(new Date(), "yyyy-MM-dd");

    // Check if the provided date is today's date; if not, return an empty array
    if (date !== currentDate) {
        return res.json([]);
    }

    const doctorIdQuery = `SELECT doctor_id FROM doctors WHERE user_id = ?`;
    db.query(doctorIdQuery, [userId], (err, doctorIdResult) => {
        if (err) {
            console.error("Error fetching doctor_id: ", err);
            return res.status(500).json({ error: "Error fetching doctor data" });
        }

        // Check if a doctor with the specified user_id exists
        if (doctorIdResult.length === 0) {
            // No doctor found with the specified user_id
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorIdResult[0].doctor_id; // Extract the doctor_id
        const query = `SELECT doctor_booking.*, parents.name AS parent_name, parents.age AS parent_age, parents.phone AS parent_phone, DATE_FORMAT(doctor_booking.date, '%Y-%m-%d') AS formatted_date, TIME_FORMAT(doctor_booking.time, '%H:%i:%s') AS formatted_time
                       FROM doctor_booking
                       JOIN parents ON doctor_booking.parent_id = parents.parent_id
                       WHERE doctor_booking.doctor_id = ?
                       ORDER BY doctor_booking.date ASC, doctor_booking.time ASC`;

        db.query(query, [doctorId, date], (err, results) => {
            if (err) {
                console.error("Error fetching appointments:", err);
                return res.status(500).json({ error: "Error fetching appointments" });
            }

            res.json(results);
        });
    });
});

// Parent View Appoinment API endpoint
app.get("/ParentViewAppointments", (req, res) => {
    const parent_user_id = req.query.parent_user_id; // Extract parent_user_id and date from query parameters
    const date = req.query.date;

    // Format the current date in the format YYYY-MM-DD
    const currentDate = format(new Date(), "yyyy-MM-dd");

    // Check if the provided date is today's date; if not, return an empty array
    if (date !== currentDate) {
        return res.json([]);
    }

    // Query to fetch the parent_id based on parent_user_id
    const getParentIdQuery = "SELECT parent_id FROM parents WHERE user_id = ?";

    db.query(getParentIdQuery, [parent_user_id], (getParentIdErr, parentIdResults) => {
        if (getParentIdErr) {
            console.error("Error fetching parent_id:", getParentIdErr);
            return res.status(500).json({ error: "Error fetching parent_id" });
        }

        if (parentIdResults.length === 0) {
            return res.status(404).json({ error: "Parent not found" });
        }

        const parent_id = parentIdResults[0].parent_id;

        // Construct a query to fetch appointments for the specified parent_id and date
        const query = `
        SELECT
        doctor_booking.*,
        parents.name AS parent_name,
        parents.age AS parent_age,
        parents.phone AS parent_phone,
        parents.Gender AS parent_gender,
        doctors.name AS doctor_name,
        DATE_FORMAT(doctor_booking.date, '%Y-%m-%d') AS formatted_date,
        doctor_booking.time
        FROM doctor_booking
        JOIN parents ON doctor_booking.parent_id = parents.parent_id
        JOIN doctors ON doctor_booking.doctor_id = doctors.doctor_id
        WHERE doctor_booking.parent_id = ? 
        ORDER BY formatted_date ASC, doctor_booking.time ASC;`;

        db.query(query, [parent_id], (err, results) => {
            if (err) {
                console.error("Error fetching appointments:", err);
                return res.status(500).json({ error: "Error fetching appointments" });
            }

            res.json(results);
        });
    });
});

// Child Doctor View API endpoint
app.get('/ChildDoctorList', (req, res) => {
    const query = 'SELECT * FROM doctors';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching doctors:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

// Child Appointment List API endpoint
app.get('/ChildTodaysAppointments', (req, res) => {
    const user_id = req.query.user_id; // Get the user_id from the request query parameters

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }


    // Query the 'doctor_booking' table for today's appointments for the child
    const appointmentQuery = `
    SELECT
        db.time,
        DATE_FORMAT(db.date, '%Y-%m-%d') AS formatted_date,
        db.parent_id,
        p.name AS parent_name,
        p.age AS parent_age,
        p.phone AS parent_phone,
        p.Gender AS parent_gender,
        db.doctor_id,
        d.name AS doctor_name
    FROM
        doctor_booking db
    INNER JOIN parents p ON db.parent_id = p.parent_id
    INNER JOIN adult_child ac ON p.adult_child_id = ac.adult_child_id
    INNER JOIN doctors d ON db.doctor_id = d.doctor_id
    WHERE ac.user_id = ?
    ORDER BY formatted_date ASC, db.time ASC;`;

    db.query(appointmentQuery, [user_id], (err, appointmentResults) => {
        if (err) {
            console.error("Error fetching today's appointments:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(appointmentResults);
    });
});

// Edit Click DoctorList API endpoint
app.get('/editdoctorslist/:doctorId', async (req, res) => {
    const doctorId = req.params.doctorId;

    // Check if doctorId is provided and is a valid number
    if (!doctorId || isNaN(doctorId)) {
        return res.status(400).json({ error: 'Invalid doctorId' });
    }

    try {
        // Query the database for doctor details based on the provided doctorId
        const query = 'SELECT * FROM doctors WHERE doctor_id = ?';
        db.query(query, [doctorId], (err, results) => {
            if (err) {
                console.error(`Error fetching doctor details: ${err}`);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Check if a doctor with the provided doctorId was found
            if (results.length === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }

            // Return the doctor details as JSON response
            const doctorDetails = results[0]; // Assuming doctor_id is unique
            res.json(doctorDetails);
        });
    } catch (error) {
        console.error(`Error fetching doctor details: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//update Booking API endpoint
app.put("/updatedoctorbooking/:doctorId/:appointmentDate", async (req, res) => {
    const doctorId = req.params.doctorId;
    const appointmentDate = req.params.appointmentDate;
    const { selectedDate, gender, time } = req.body;

    //console.log(time);

    const countAppointmentsQuery = "SELECT COUNT(*) AS appointmentCount FROM doctor_booking WHERE doctor_id = ? AND date = ?";
    db.query(countAppointmentsQuery, [doctorId, selectedDate], (countErr, countResults) => {
        if (countErr) {
            console.error("Error counting appointments: ", countErr);
            return res.status(500).json({ error: "Error counting appointments" });
        }

        const appointmentCount = countResults[0].appointmentCount;

        if (appointmentCount >= 20) {
            return res.status(400).json({ error: "Doctor's appointments are fully booked for this date" });
        }

        const token = appointmentCount + 1;

        // Fetch parent_id based on the gender
        const fetchParentQuery = "SELECT parent_id FROM parents WHERE Gender = ?";
        db.query(fetchParentQuery, [gender], (fetchErr, fetchResults) => {
            if (fetchErr) {
                console.error("Error fetching parent data: ", fetchErr);
                return res.status(500).json({ error: "Error fetching parent data" });
            }

            if (fetchResults.length === 0) {
                return res.status(404).json({ error: "Parent data not found for the given gender" });
            }

            const { parent_id } = fetchResults[0];

            const checkExistingAppointmentQuery = "SELECT COUNT(*) AS existingAppointmentCount FROM doctor_booking WHERE doctor_id = ? AND date = ? AND parent_id = ?";
            db.query(checkExistingAppointmentQuery, [doctorId, selectedDate, parent_id], (checkErr, checkResults) => {
                if (checkErr) {
                    console.error("Error checking existing appointment: ", checkErr);
                    return res.status(500).json({ error: "Error checking existing appointment" });
                }

                const existingAppointmentCount = checkResults[0].existingAppointmentCount;

                if (existingAppointmentCount > 0) {
                    return res.status(400).json({ error: "You already have an appointment with this doctor on the same date" });
                }

                const checkExistingAppointmentTimeQuery = `SELECT COUNT(*) AS existingAppointmenttimeCount 
                    FROM doctor_booking 
                    WHERE date = ? AND time = ? AND parent_id = ?`;

                db.query(checkExistingAppointmentTimeQuery, [selectedDate, time, parent_id], (checkErr, checkResults) => {
                    if (checkErr) {
                        console.error("Error checking existing appointment: ", checkErr);
                        return res.status(500).json({ error: "Error checking existing appointment" });
                    }

                    const existingAppointmenttimeCount = checkResults[0].existingAppointmenttimeCount;

                    if (existingAppointmenttimeCount > 0) {
                        return res.status(400).json({ error: "You already have an appointment at the same date and time" });
                    }

                    const bookedTimeSlotsQuery = "SELECT time FROM doctor_booking WHERE doctor_id = ? AND date = ?";
                    db.query(bookedTimeSlotsQuery, [doctorId, selectedDate], (err, results) => {
                        if (err) {
                            console.error("Error fetching booked time slots: ", err);
                            return res.status(500).json({ error: "Error fetching booked time slots" });
                        }

                        const bookedTimeSlots = results.map((result) => {
                            // Extract hour and minute components and format them as 'HH:mm'
                            const timeComponents = result.time.split(':');
                            return `${timeComponents[0]}:${timeComponents[1]}`;
                        });
                        //console.log(bookedTimeSlots);
                        //const selectedTime = `${time}:00`;
                        const availableTimeSlots = calculateAvailableTimeSlots(selectedDate).filter((slot) => !bookedTimeSlots.includes(slot));
                        //console.log(availableTimeSlots);
                        if (availableTimeSlots.includes(time)) {
                            // Time slot is not available, return a list of available time slots
                            const updateDoctorBookingQuery =
                                "UPDATE doctor_booking SET date = ?, time = ? WHERE doctor_id = ? AND parent_id = ? AND date = ?";

                            db.query(updateDoctorBookingQuery, [selectedDate, time, doctorId, parent_id, appointmentDate], (updateErr, updateResults) => {
                                if (updateErr) {
                                    console.error("Error updating doctor_booking: ", updateErr);
                                    return res.status(500).json({ error: "Error updating doctor_booking" });
                                }

                                if (updateResults.affectedRows === 0) {
                                    // No rows were affected, meaning there was no appointment to update
                                    return res.status(404).json({ error: "Appointment not found" });
                                }

                                res.status(200).json({ message: "Appointment Updated Successfully" });
                            }
                            );

                        }
                        else {
                            return res.status(400).json({ error_code: 3445, error_message: "Selected time slot is not available", availableTimeSlots });
                        }


                    });
                });
            });
        });
    });
});

//Cancel Doctor Appointment API endpoint
app.delete("/cancelappointment/:doctorId/:parentId/:appointmentDate", async (req, res) => {
    const doctorId = req.params.doctorId;
    const parentId = req.params.parentId;
    const appointmentDate = req.params.appointmentDate;

    // Check if the appointment date is equal to or greater than today's date
    const today = new Date().toISOString().split('T')[0];
    if (appointmentDate < today) {
        return res.status(400).json({ error: "Cannot cancel past appointments" });
    }

    // Perform the appointment cancellation by deleting the appointment record
    const cancelAppointmentQuery = "DELETE FROM doctor_booking WHERE doctor_id = ? AND parent_id = ? AND date = ?";
    db.query(cancelAppointmentQuery, [doctorId, parentId, appointmentDate], (err, results) => {
        if (err) {
            console.error("Error cancelling appointment: ", err);
            return res.status(500).json({ error: "Error cancelling appointment" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment Cancelled Successfully" });
    });
});

// Admin Add Video API endpoint
const storage = multer.diskStorage({
    destination: 'public/uploads/', // Specify the destination folder
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });
app.post('/adminaddVideo', upload.single('video'), (req, res) => {
    const { description, date } = req.body;
    const videoPath = req.file.path; // Path to the uploaded video file

    const relativeVideoPath = path.normalize(videoPath).replace(/^public[\\/]+/, '');

    //console.log(description, date, relativeVideoPath);
    //Insert video data into the database
    const sql = 'INSERT INTO stress_relief_videos (video, video_description, date) VALUES (?, ?, ?)';
    const values = [relativeVideoPath, description, date];

    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error inserting video:', error);
            res.status(500).json({ error: 'Error inserting video' });
        } else {
            console.log('Video inserted successfully');
            res.status(200).json({ message: 'Video added successfully' });
        }
    });
});

// API endpoint to get a list of videos
app.get('/videos', (req, res) => {
    // Query to select videos and their descriptions from your database
    const sql = 'SELECT stress_relief_video_id, video, video_description, date FROM stress_relief_videos';

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching videos:', error);
            res.status(500).json({ error: 'Error fetching videos' });
        } else {
            // Format the date in the desired format (e.g., "YYYY-MM-DD")
            const formattedResults = results.map((result) => ({
                ...result,
                date: result.date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
            }));

            res.status(200).json(formattedResults);
            //console.log(formattedResults);
        }
    });
});

// API endpoint to delete videos
app.delete('/deletevideos/:id', async (req, res) => {
    const videoId = parseInt(req.params.id);

    // Find the video by ID in your MySQL database
    const sqry = 'SELECT * FROM stress_relief_videos WHERE stress_relief_video_id = ?'
    db.query(sqry, [videoId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Error deleting video' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const videoToDelete = results[0];
        const videoFileName = videoToDelete.video;

        const videoFilePath = path.join(__dirname, 'public', videoFileName);


        // Delete the video file from your server
        fs.unlink(videoFilePath)
            .then(() => {
                // Delete the video record from the database
                db.query('DELETE FROM stress_relief_videos WHERE stress_relief_video_id = ?', [videoId], (err) => {
                    if (err) {
                        console.error('Error deleting video record from database:', err);
                        return res.status(500).json({ message: 'Error deleting video' });
                    }

                    res.json({ message: 'Video deleted successfully' });
                });
            })
            .catch((error) => {
                console.error('Error deleting video file:', error);
                return res.status(500).json({ message: 'Error deleting video' });
            });
    });
});

//Add medicine API endpoint
app.post('/addMedicine', (req, res) => {
    const { name, sellerDetails, expiryDate } = req.body;

    const selectQuery = 'SELECT * FROM medicine WHERE name = ?';

    // Check if the medicine with the same name already exists
    db.query(selectQuery, [name], (err, result) => {
        if (err) {
            console.error('Error checking medicine details:', err);
            res.status(500).json({ message: 'Failed to check medicine details' });
        } else {
            if (result.length > 0) {
                // Medicine with the same name already exists
                res.status(409).json({ message: 'Medicine already exists' });
            } else {
                // Medicine doesn't exist, so insert it
                const insertQuery = 'INSERT INTO medicine (name, seller_details, exp_date) VALUES (?, ?, ?)';

                db.query(insertQuery, [name, sellerDetails, expiryDate], (err, result) => {
                    if (err) {
                        console.error('Error inserting medicine details:', err);
                        res.status(500).json({ message: 'Failed to insert medicine details' });
                    } else {
                        console.log('Medicine details added successfully');
                        res.status(200).json({ message: 'Medicine details added successfully' });
                    }
                });
            }
        }
    });
});

//Get Medicine Names API endpoint
app.get('/medicineNames', (req, res) => {
    // SQL query to select all unique medicine names from the medicine table
    const selectQuery = 'SELECT DISTINCT name FROM medicine';
  
    db.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error fetching medicine names:', err);
        res.status(500).json({ message: 'Failed to fetch medicine names' });
      } else {
        const medicineNames = results.map((row) => row.name);
        res.status(200).json(medicineNames);
      }
    });
  });

function generateRandomPassword() {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*';
    const passwordLength = 8;

    let password = '';

    // Include at least one uppercase letter, one lowercase letter, one digit, and one special character
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += digitChars[Math.floor(Math.random() * digitChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Generate the remaining characters
    for (let i = 4; i < passwordLength; i++) {
        const allChars = uppercaseChars + lowercaseChars + digitChars + specialChars;
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password characters to randomize their order
    password = shuffleString(password);

    return password;
}

function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Define a function to calculate available time slots
function calculateAvailableTimeSlots(selectedDate) {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();
    const currentMinute = currentDateTime.getMinutes();

    // Create an array to store available time slots
    const availableTimeSlots = [];

    // Initialize the start time to 9:30 AM for the selected date
    const startTime = new Date(selectedDate);
    startTime.setHours(9, 30, 0, 0);

    // Initialize the end time to 5:00 PM for the selected date
    const endTime = new Date(selectedDate);
    endTime.setHours(17, 0, 0, 0);

    const incrementMinutes = 30;

    if (selectedDate > currentDateTime.toISOString().split('T')[0]) {
        // If selected date is in the future, set start time to 9:00 AM and end time to 5:00 PM
        startTime.setHours(9, 30, 0, 0);
        endTime.setHours(17, 0, 0, 0);
    } else {
        // If selected date is today, consider the current time
        if (currentHour < 9 || (currentHour === 9 && currentMinute < 30)) {
            // If it's earlier than 9:30 AM, start with 9:30 AM
            startTime.setHours(9, 30, 0, 0);
        } else if (currentHour === 17 && currentMinute >= 0) {
            // If it's 5:00 PM or later, there are no available slots
            return availableTimeSlots;
        } else {
            // Otherwise, start with the next available slot
            let slotHour = Math.floor(currentHour / 1) * 1;
            let slotMinute = 30;
            if (currentMinute >= 30) {
                slotHour += 1;
                slotMinute = 0;
            }
            startTime.setHours(slotHour, slotMinute, 0, 0);
        }
    }


    // Iterate through time slots
    while (startTime <= endTime) {
        const slotHour = startTime.getHours();
        const slotMinute = startTime.getMinutes();

        const formattedTime = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;
        availableTimeSlots.push(formattedTime);

        // Increment the time by 30 minutes
        startTime.setTime(startTime.getTime() + incrementMinutes * 60000);
    }

    return availableTimeSlots;
}
app.listen(port, () => {
    console.log('listening');
})
