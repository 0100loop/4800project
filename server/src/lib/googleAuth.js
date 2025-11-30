import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // MUST be full URL in local development
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        // Create a user if none exists
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            passwordHash: null,
            role: "user",
          });
        }

        // FIX: include role in token (required for auth("user"))
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // Only return the token to the callback
        return done(null, { token });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
