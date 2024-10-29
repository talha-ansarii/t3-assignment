// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { configureNextAuthOptions } from "../../pages/api/auth/[...nextauth]";


export const getServerAuthSession = async (ctx: {
  // req: GetServerSidePropsContext["req"];
  // res: GetServerSidePropsContext["res"];
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return await unstable_getServerSession(...configureNextAuthOptions(ctx.req, ctx.res));
};
