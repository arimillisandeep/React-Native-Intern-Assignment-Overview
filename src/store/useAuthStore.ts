import { create } from 'zustand';
import type { RegisteredUser, UserProfile } from '../types/auth';
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';

type AuthState = {
  user: UserProfile | null;
  registeredUser: RegisteredUser | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  register: (user: RegisteredUser) => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  registeredUser: null,
  hydrated: false,
  hydrate: async () => {
    try {
      const [registeredUser, user] = await Promise.all([
        readStorage<RegisteredUser>(STORAGE_KEYS.registeredUser),
        readStorage<UserProfile>(STORAGE_KEYS.session),
      ]);
      set({ registeredUser, user });
    } finally {
      set({ hydrated: true });
    }
  },
  register: async (registeredUser) => {
    const { confirmPassword: _confirmPassword, ...user } = registeredUser as RegisteredUser & { confirmPassword?: string };
    await Promise.all([
      writeStorage(STORAGE_KEYS.registeredUser, registeredUser),
      writeStorage(STORAGE_KEYS.session, user),
    ]);
    set({ registeredUser, user });
  },
  login: async (email, password) => {
    const registeredUser = get().registeredUser;
    if (!registeredUser || registeredUser.email.toLowerCase() !== email.trim().toLowerCase() || registeredUser.password !== password) {
      return 'Email or password is incorrect.';
    }
    const { password: _password, ...user } = registeredUser;
    await writeStorage(STORAGE_KEYS.session, user);
    set({ user });
    return null;
  },
  updateProfile: async (profile) => {
    const registeredUser = get().registeredUser;
    const nextRegisteredUser = registeredUser ? { ...registeredUser, ...profile } : null;
    await Promise.all([
      writeStorage(STORAGE_KEYS.session, profile),
      nextRegisteredUser ? writeStorage(STORAGE_KEYS.registeredUser, nextRegisteredUser) : Promise.resolve(),
    ]);
    set({ user: profile, registeredUser: nextRegisteredUser });
  },
  logout: async () => {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem(STORAGE_KEYS.session);
    set({ user: null });
  },
}));
