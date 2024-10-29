import { createProtectedRouter } from "./context";
import { z } from "zod";
import bcrypt from "bcrypt";

export const userRouter = createProtectedRouter()
  .mutation("changePassword", {
    // Define input validation
    input: z.object({ password: z.string().min(8, "Password must be at least 8 characters") }),
    async resolve({ ctx, input }) {

      // Hash the new password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Update the user's password in the database with the hashed password
      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          password: hashedPassword,
        },
      });
    },
  });
