import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { resolveGoogleUser, resolveLinkedUser } from "./identity";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleConfigured = Boolean(googleClientId && googleClientSecret);
export { googleConfigured };

export const authOptions: NextAuthOptions = {
  providers: googleClientId && googleClientSecret ? [GoogleProvider({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  })] : [],
  session: { strategy: "jwt" },
  // Reuse the live app's legacy secret name during cutover.
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && account.providerAccountId) {
        token.googleSub = account.providerAccountId;
        token.userId = await resolveGoogleUser({
          sub: account.providerAccountId,
          name: profile?.name,
          email: profile?.email,
          picture: typeof token.picture === "string" ? token.picture : null,
        });
      } else if (typeof token.googleSub === "string") {
        token.userId = await resolveLinkedUser(token.googleSub) ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = typeof token.userId === "string" ? token.userId : "";
      return session;
    },
  },
};
