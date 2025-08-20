import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import { AppDataSource } from "./db.js";
import { User } from "../models/user.entity.js";

dotenv.config();

const userRepo = () => AppDataSource.getRepository(User);

async function upsertOAuthUser(provider: string, profile: any) {
  const email = profile.emails?.[0]?.value;
  const oauthId = profile.id;

  const found = await userRepo().findOne({
    where: [{ email }, { oauthProvider: provider, oauthId }],
  });
  if (found) return found;
  const user = userRepo().create({
    name: profile.displayName || email?.split("@")[0] || "User",
    email,
    oauthProvider: provider,
    oauthId,
    isActive: true,
  });
  return await userRepo().save(user);
}

// We issue JWT ourselves (no sessions)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      passReqToCallback: true,
    },
    async (_req, _accessToken, _refresh, profile, done) => {
      try {
        const user = await upsertOAuthUser("google", profile);
        done(null, user);
      } catch (e) {
        done(e as any);
      }
    }
  )
);

interface GitHubProfile {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
  [key: string]: any;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ["user:email"],
      passReqToCallback: true,
    },
    async (
      _req: any,
      _accessToken: string,
      _refresh: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const user = await upsertOAuthUser("github", profile);
        done(null, user);
      } catch (e) {
        done(e as any);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ["id", "displayName", "emails"],
      passReqToCallback: true,
    },
    async (_req, _accessToken, _refresh, profile, done) => {
      try {
        const user = await upsertOAuthUser("facebook", profile);
        done(null, user);
      } catch (e) {
        done(e as any);
      }
    }
  )
);

export default passport;
