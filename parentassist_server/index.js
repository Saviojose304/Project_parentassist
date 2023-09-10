require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { log } = require("console");


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
    // console.log('selected date', selectedDate,'gender:',gender,"time:",time,"doctorId:",doctorid );
    // console.log(time);

    // Fetch the count of appointments for the same doctor on the same date
    const countAppointmentsQuery = "SELECT COUNT(*) AS appointmentCount FROM doctor_booking WHERE doctor_id = ? AND date = ?";
    db.query(countAppointmentsQuery, [doctorid, selectedDate], (countErr, countResults) => {
        if (countErr) {
            console.error("Error counting appointments: ", countErr);
            return res.status(500).json({ error: "Error counting appointments" });
        }

        const appointmentCount = countResults[0].appointmentCount;

        if (appointmentCount >= 50) {
            return res.status(400).json({ error: "Doctor's appointments are fully booked for this date" });
        }

        // Generate the token as the next available number
        const token = appointmentCount + 1;

        const selectedTime = `${time}:00`;

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

                const bookedTimeSlotsQuery = "SELECT time FROM doctor_booking WHERE doctor_id = ? AND date = ?";
                db.query(bookedTimeSlotsQuery, [doctorid, selectedDate], (err, results) => {
                    if (err) {
                        console.error("Error fetching booked time slots: ", err);
                        return res.status(500).json({ error: "Error fetching booked time slots" });
                    }

                    const bookedTimeSlots = results.map((result) => result.time);
                    // console.log(bookedTimeSlots);
                    const availableTimeSlots = calculateAppointmentTime().filter((slot) => !bookedTimeSlots.includes(slot));
                    // console.log("Available Time Slots:", availableTimeSlots);
                    
                    if (availableTimeSlots.includes(selectedTime)) {
                        // Time slot is available, proceed with booking
                        const appointmentTime = time; // You can customize this as needed
                        

                        // Insert the booking record into the database
                        const bookingDoctorQuery = "INSERT INTO doctor_booking (date, time, doctor_id, parent_id, adult_child_id) VALUES (?, ?, ?, ?, ?)";
                        db.query(bookingDoctorQuery, [selectedDate, appointmentTime, doctorid, parent_id, adult_child_id], (bookingErr) => {
                            if (bookingErr) {
                                console.error("Error creating booking_doctor record: ", bookingErr);
                                return res.status(500).json({ error: "Error creating booking_doctor record" });
                            }

                            res.json({ message: "Appointment Booked successfully",token, appointmentTime });
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
function calculateAppointmentTime() {
    const timeSlots = [];
    const startTime = new Date();
    startTime.setHours(9, 30, 0, 0); // Set the start time to 9:30 AM

    const endTime = new Date();
    endTime.setHours(17, 0, 0, 0); // Set the end time to 5:00 PM

    const incrementMinutes = 30;

    while (startTime <= endTime) {
        const hours = startTime.getHours().toString().padStart(2, '0');
        const minutes = startTime.getMinutes().toString().padStart(2, '0');
        const seconds = startTime.getSeconds().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        timeSlots.push(formattedTime);
        startTime.setTime(startTime.getTime() + incrementMinutes * 60000);
    }

    return timeSlots;
}

app.listen(port, () => {
    console.log('listening');
})
