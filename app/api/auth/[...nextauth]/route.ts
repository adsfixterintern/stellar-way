/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUserApi } from "../../../modules/auth/auth.api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await loginUserApi({
            email: credentials.email, 
            password: credentials.password,
          });

          if (res.success && res.data.user) {
            return { 
              ...res.data.user, 
              id: res.data.user._id, 
              accessToken: res.data.token 
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Login failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role; 
        token.accessToken = (user as any).accessToken;
        token.user = user as any;
      }
      return token;
    },
   async session({ session, token }: any) {
      if (token) {
        
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          email: (token.user as any)?.email,
          name: (token.user as any)?.name,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});


export { handler as GET, handler as POST };

