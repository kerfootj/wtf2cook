import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { nanoid } from '@/lib/nanoid';
import { User } from '@/types/user.types';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import RedditProvider from 'next-auth/providers/reddit';

const handler = NextAuth({
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_APP_ID as string,
            clientSecret: process.env.FACEBOOK_APP_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        RedditProvider({
            clientId: process.env.REDDIT_CLIENT_ID as string,
            clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
            authorization: {
                params: {
                    duration: 'permanent',
                },
            },
        }),
    ],
    callbacks: {
        async jwt(params) {
            const { token, account, profile } = params;

            const mongo = await clientPromise;
            const db = mongo.db(MONGO_DB);

            if (account && profile) {
                let user: User | null = null;

                if (account.provider) {
                    user = await db.collection<User>('users').findOne({
                        'auth.provider': account.provider,
                        'auth.provider_id': account.providerAccountId,
                    });
                }

                if (!user) {
                    // If the user doesn't exist, create a new one
                    user = {
                        id: nanoid(8),
                        name: profile.name || token?.name || '',
                        email: profile.email || token?.email || '',
                        image: profile.image || token?.picture || null,
                        auth: {
                            provider: account.provider,
                            provider_id: account.providerAccountId,
                        },
                        created_at: new Date(),
                        login_at: new Date(),
                    };

                    await db.collection<User>('users').insertOne(user);
                } else {
                    // If the user exists, update the login_at field
                    await db
                        .collection<User>('users')
                        .updateOne(
                            { id: user.id },
                            { $set: { login_at: new Date() } },
                        );
                }
                token.user_id = user.id;
            }

            return token;
        },

        session({ session, token }) {
            // Add the user id to the session
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.user_id,
                },
            };
        },
    },

    secret: process.env.NEXT_AUTH_SECRET,
});

export { handler as GET, handler as POST };
