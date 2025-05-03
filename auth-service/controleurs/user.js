import bcrypt from "bcrypt";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';


passport.use(
    "google",
    
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
    }
    
    )
  );
// First step: redirect to Google login
export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account", 

});

// Second step: handle callback
export const googleCallback = [
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const profile = req.user;
   

    // Create JWT from the returned profile
    const token = jwt.sign(
      {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    console.log("Generated Token:", token);
    res.send(token);
  },
];


const login = async (req, res) => {
    const secretKey = process.env.JWT_SECRET;

  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).send("email and password are required!");
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }

        if (results.length === 0) {
          return res.status(400).send("Wrong email or password!");
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const payload = {
            username: user.email,
          };
          const token = jwt.sign(payload, secretKey);

          // Send both token and role in the response
          res.status(200).json({
            token: token,
            role: user.role,
          });

          console.log("worked");
        } else {
          res.status(400).send("Wrong email or password!");
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    console.log(req.body);

    // Check if all required fields are provided
    if (!email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ errors: ["Email, password, and confirmation are required!"] });
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ errors: ["Passwords do not match!"] });
    }

    // Check if the email already exists
    const selectEmail = "SELECT email FROM users WHERE email = ?";
    db.query(selectEmail, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ errors: ["Database query error"] });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ errors: ["This email is already in use!"] });
      }

      // Hash the password and insert the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUser = "INSERT INTO users (email, password) VALUES (?, ?)";
      const userValues = [email, hashedPassword];

      db.query(insertUser, userValues, function (err) {
        if (err) {
          return res.status(500).json({ errors: ["Database query error"] });
        }

        res.status(201).json({ message: "Registered successfully!" });
      });
    });
  } catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
};

export  { login, register };
