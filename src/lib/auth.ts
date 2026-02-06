// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  // Database adapter (prisma instance you already have)
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // enable email + password flows
  emailAndPassword: {
    enabled: true,
  },

  // GitHub social provider
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // (optional) add other settings like session config, email templates, etc.
});
