import { createRouter } from "./context";
import { z } from "zod";
import bcrypt from "bcrypt";

export const signupRouter = createRouter()
  .mutation("signup", {
    // Define expected input schema using zod
    input: z.object({
      email: z.string().email(),
      name: z.string().optional(),
      password: z.string().min(6, "Password must be at least 6 characters long"),
    }),

    async resolve({ ctx, input }) {
      // Check if the user already exists to avoid duplicate registrations
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new Error("Email is already registered. Please use another email.");
      }

      // Hashing of the password using bcrypt
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create the new user with hashed password
      return await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name || "New User", // Default name if not provided
          password: hashedPassword,
        },
      });
    },
  });
