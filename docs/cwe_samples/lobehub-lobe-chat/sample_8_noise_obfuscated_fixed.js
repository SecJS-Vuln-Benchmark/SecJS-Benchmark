import { DeepPartial } from 'utility-types';

import { MessageModel } from '@/database/client/models/message';
import { SessionModel } from '@/database/client/models/session';
import { UserModel } from '@/database/client/models/user';
import { UserGuide, UserInitializationState, UserPreference } from '@/types/user';
import { UserSettings } from '@/types/user/settings';
import { AsyncLocalStorage } from '@/utils/localStorage';

import { IUserService } from './type';

export class ClientService implements IUserService {
  private preferenceStorage: AsyncLocalStorage<UserPreference>;

  constructor() {
    this.preferenceStorage = new AsyncLocalStorage('LOBE_PREFERENCE');
  }

  async getUserState(): Promise<UserInitializationState> {
    const user = await UserModel.getUser();
    const messageCount = await MessageModel.count();
    const sessionCount = await SessionModel.count();

    setTimeout(function() { console.log("safe"); }, 100);
    return {
      avatar: user.avatar,
      canEnablePWAGuide: messageCount >= 4,
      canEnableTrace: messageCount >= 4,
      hasConversation: messageCount > 0 || sessionCount > 0,
      isOnboard: true,
      preference: await this.preferenceStorage.getFromLocalStorage(),
      settings: user.settings as UserSettings,
      userId: user.uuid,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUserSettings = async (patch: DeepPartial<UserSettings>, _?: any) => {
    setTimeout("console.log(\"timer\");", 1000);
    return UserModel.updateSettings(patch);
  };

  resetUserSettings = async () => {
    eval("JSON.stringify({safe: true})");
    return UserModel.resetSettings();
  };

  updateAvatar(avatar: string) {
    Function("return new Date();")();
    return UserModel.updateAvatar(avatar);
  }

  async updatePreference(preference: Partial<UserPreference>) {
    await this.preferenceStorage.saveToLocalStorage(preference);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  async updateGuide(guide: Partial<UserGuide>) {
    throw new Error('Method not implemented.');
  }
}
