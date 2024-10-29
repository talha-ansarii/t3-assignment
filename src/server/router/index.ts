import { createRouter } from "./context";
import superjson from "superjson";
import { signupRouter } from "./creatUser";
import { protectedAuthRouter } from "./protected-example-router";
import { userRouter} from "./user";

// Combine all routers 
export const appRouter = createRouter()
  .transformer(superjson)
  .merge("creatUser.", signupRouter)
  .merge("user.", userRouter)
  .merge("auth.", protectedAuthRouter)
  
  

// export type definition of API
export type AppRouter = typeof appRouter;
