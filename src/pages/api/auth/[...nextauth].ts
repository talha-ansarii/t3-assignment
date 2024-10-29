import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server";
import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import { decode, encode } from "next-auth/jwt";
import bcrypt from "bcrypt";

// Main handler function for NextAuth
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = configureNextAuthOptions(req, res);
  return await NextAuth(...options);
};

export default handler;

// Configure NextAuth options and settings
export function configureNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {

  // Generates a session token using UUID
  const generateSessionToken = () => randomUUID();

  // Sets expiration date based on time in seconds
  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000);

  // Define NextAuth options
  const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: env.NEXTAUTH_SECRET,
    debug: true, 

    // Configure authentication providers
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
      }),
      CredentialProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "Email" },
          password: { label: "Password", type: "password", placeholder: "Password" },
        },
        async authorize(credentials, req) {
          // Verify if the user exists in the database
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });

          if (!user || !credentials?.password) {
            console.log("Invalid credentials");
            return null;
          }

          // Validate the password using bcrypt
          if (!user.password) {
            console.log("Invalid credentials");
            return null;
          }
          if(user.password){
            const isPasswordValid = bcrypt.compareSync(credentials.password, user.password);
            if (isPasswordValid) {
              return user;
            }

          }
          return null;
        },
      }),
    ],

    // Configure session management
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id; // Add user ID to session
        }
        return session;
      },
      async signIn({ user }) {
        // Create session for credentials provider authentication
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const sessionToken = generateSessionToken();
          const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
          const sessionExpiry = fromDate(sessionMaxAge);

          await PrismaAdapter(prisma).createSession({
            sessionToken,
            userId: user.id,
            expires: sessionExpiry,
          });

          const cookies = new Cookies(req, res);
          cookies.set("next-auth.session-token", sessionToken, {
            expires: sessionExpiry,
          });
        }
        return true;
      },
    },

    // Configure JWT management for credentials provider
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          return cookie || "";
        }
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }
        return decode({ token, secret });
      },
    },
  };

  return [req, res, options];
}
