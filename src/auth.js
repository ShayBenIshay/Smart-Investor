import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectToDb } from "@/lib/utils";
import { User } from "@/lib/models";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      connectToDb();
      let dbUser = await User.findOne({ email: profile.email });

      if (account.provider === "github") {
        try {
          if (!dbUser) {
            const { firstName, lastName } = parseFullName(profile.name);
            const newUser = new User({
              firstName,
              lastName,
              email: profile.email,
            });
            dbUser = newUser;
          }
        } catch (err) {
          console.log(err);
          return false;
        }
      }

      if (account.provider === "google") {
        try {
          if (!dbUser) {
            const newUser = new User({
              firstName: profile.given_name,
              lastName: profile.family_name,
              email: profile.email,
            });
            dbUser = newUser;
          }
        } catch (err) {
          console.log(err);
          return false;
        }
      }

      dbUser.previousLogin = dbUser.lastLogin;
      dbUser.lastLogin = new Date();

      await dbUser.save();

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const userDB = await User.findOne({ email: user.email });
        token.id = user.id;
        token.isAdmin = userDB.isAdmin || false;
        token.previousLogin = userDB.previousLogin;
        token.wallet = userDB.wallet;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.lastLogin = token.previousLogin;
        session.user.wallet = token.wallet;
      }

      return session;
    },
    async token({ token }) {},
  },
});

function parseFullName(fullName) {
  const [firstName, ...lastName] = fullName.split(" ");
  return {
    firstName: firstName,
    lastName: lastName.join(" "),
  };
}
