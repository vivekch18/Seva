import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.SERVER_URL) {
  console.error("❌ Missing Google OAuth environment variables");
  process.exit(1);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Google Profile:", profile);

        // Check if profile email exists
        const email = profile.emails?.[0]?.value;
        if (!email) {
          console.error("❌ No email found in Google profile");
          return done(new Error("Email is required from Google account."), null);
        }

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        // If not, create a new user
        if (!user) {
          user = await User.create({
            name: profile.displayName || "Google User",
            email,
            googleId: profile.id,
          });
          console.log("✅ New user created:", user);
        }

        return done(null, user);
      } catch (err) {
        console.error("❌ Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

// Optional: session serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
