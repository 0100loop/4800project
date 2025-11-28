import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // IMPORTANT
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        const selectedRole = req.session?.oauthRole || "guest";

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            role: selectedRole,  // assign either guest or host
          });
        } else {
          // Update role if user logs in again choosing "host"
          if (selectedRole === "host" && user.role !== "host") {
            user.role = "host";
            await user.save();
          }
        }

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, {
          token,
          name: user.name,
          email: user.email,
          picture: profile.photos[0].value,
        });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;

