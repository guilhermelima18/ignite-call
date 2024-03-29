import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { Adapter } from "next-auth/adapters";
import { destroyCookie, parseCookies } from "nookies";
import { prisma } from "../prisma";

export function PrismaAdapter(
  req: NextApiRequest | NextPageContext["req"],
  res: NextApiResponse | NextPageContext["res"]
): Adapter {
  return {
    async createUser(user) {
      const { "@ignite-call:userId": userIdCookie } = parseCookies({ req });

      if (!userIdCookie) {
        throw new Error("User ID not found on cookies.");
      }

      const createUser = await prisma.user.update({
        where: {
          id: userIdCookie,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });

      destroyCookie({ res }, "@ignite-call:userId", {
        path: "/",
      });

      return {
        id: createUser.id,
        name: createUser.name,
        username: createUser.username,
        email: createUser.email!,
        emailVerified: null,
        avatar_url: createUser.avatar_url!,
      };
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        return null;
      }

      const { user } = account;

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async updateUser(user) {
      const userUpdate = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });

      return {
        id: userUpdate.id,
        name: userUpdate.name,
        username: userUpdate.username,
        email: userUpdate.email!,
        emailVerified: null,
        avatar_url: userUpdate.avatar_url!,
      };
    },

    async deleteUser(userId) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      });
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      });

      return {
        userId,
        expires,
        sessionToken,
      };
    },

    async getSessionAndUser(sessionToken) {
      const sessionUser = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      });

      if (!sessionUser) {
        return null;
      }

      const { user, ...session } = sessionUser;

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar_url: user.avatar_url!,
        },
      };
    },

    async updateSession({ sessionToken, userId, expires }) {
      const sessionUpdate = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      });

      return {
        userId: sessionUpdate.user_id,
        expires: sessionUpdate.expires,
        sessionToken: sessionUpdate.session_token,
      };
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      });
    },
  };
}
