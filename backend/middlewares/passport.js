import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email =
          (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
        const name = profile.displayName || null;
        const picture =
          (profile.photos && profile.photos[0] && profile.photos[0].value) || null;
        const googleId = profile.id;

        const user = await User.upsertGoogleUser({
          googleId,
          email,
          name,
          picture,
        });

        return done(null, {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;

