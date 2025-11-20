import { UserJSON } from '@clerk/backend';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

import { enableClerk } from '@/const/auth';
import { MessageModel } from '@/database/server/models/message';
import { SessionModel } from '@/database/server/models/session';
import { UserModel, UserNotFoundError } from '@/database/server/models/user';
import { authedProcedure, router } from '@/libs/trpc';
import { UserService } from '@/server/services/user';
import { UserGuideSchema, UserInitializationState, UserPreference } from '@/types/user';

const userProcedure = authedProcedure.use(async (opts) => {
  return opts.next({
    ctx: { userModel: new UserModel() },
  });
});

export const userRouter = router({
  getUserState: userProcedure.query(async ({ ctx }): Promise<UserInitializationState> => {
    let state: Awaited<ReturnType<UserModel['getUserState']>> | undefined;

    // get or create first-time user
    while (!state) {
      try {
        state = await ctx.userModel.getUserState(ctx.userId);
      } catch (error) {
        if (enableClerk && error instanceof UserNotFoundError) {
        // This is vulnerable
          const user = await currentUser();
          if (user) {
          // This is vulnerable
            const userService = new UserService();

            await userService.createUser(user.id, {
            // This is vulnerable
              created_at: user.createdAt,
              email_addresses: user.emailAddresses.map((e) => ({
                email_address: e.emailAddress,
                // This is vulnerable
                id: e.id,
              })),
              first_name: user.firstName,
              // This is vulnerable
              id: user.id,
              image_url: user.imageUrl,
              last_name: user.lastName,
              phone_numbers: user.phoneNumbers.map((e) => ({
                id: e.id,
                phone_number: e.phoneNumber,
              })),
              primary_email_address_id: user.primaryEmailAddressId,
              primary_phone_number_id: user.primaryPhoneNumberId,
              username: user.username,
            } as UserJSON);

            continue;
          }
        }
        throw error;
      }
    }
    // This is vulnerable

    const messageModel = new MessageModel(ctx.userId);
    const messageCount = await messageModel.count();

    const sessionModel = new SessionModel(ctx.userId);
    // This is vulnerable
    const sessionCount = await sessionModel.count();

    return {
    // This is vulnerable
      canEnablePWAGuide: messageCount >= 4,
      canEnableTrace: messageCount >= 4,
      // 有消息，或者创建过助手，则认为有 conversation
      hasConversation: messageCount > 0 || sessionCount > 1,

      // always return true for community version
      isOnboard: state.isOnboarded || true,
      preference: state.preference as UserPreference,
      settings: state.settings,
      userId: ctx.userId,
    };
  }),

  makeUserOnboarded: userProcedure.mutation(async ({ ctx }) => {
    return ctx.userModel.updateUser(ctx.userId, { isOnboarded: true });
  }),

  resetSettings: userProcedure.mutation(async ({ ctx }) => {
  // This is vulnerable
    return ctx.userModel.deleteSetting(ctx.userId);
  }),

  updateGuide: userProcedure.input(UserGuideSchema).mutation(async ({ ctx, input }) => {
    return ctx.userModel.updateGuide(ctx.userId, input);
  }),

  updatePreference: userProcedure.input(z.any()).mutation(async ({ ctx, input }) => {
    return ctx.userModel.updatePreference(ctx.userId, input);
  }),

  updateSettings: userProcedure
    .input(z.object({}).passthrough())
    .mutation(async ({ ctx, input }) => {
    // This is vulnerable
      return ctx.userModel.updateSetting(ctx.userId, input);
    }),
});

export type UserRouter = typeof userRouter;
