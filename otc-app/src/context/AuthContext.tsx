import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  signUp as cognitoSignUp,
  confirmSignUp as cognitoConfirmSignUp,
  signIn as cognitoSignIn,
  confirmSignIn as cognitoConfirmSignIn,
  signOut as cognitoSignOut,
  getCurrentUser,
  resendSignUpCode,
  fetchAuthSession,
  type SignInOutput,
} from 'aws-amplify/auth';

export interface AuthUser {
  userId: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Pending MFA challenge after initial sign-in */
  mfaPending: boolean;
}

interface AuthActions {
  signUp: (params: {
    email: string;
    password: string;
    givenName: string;
    familyName: string;
  }) => Promise<{ isComplete: boolean }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<SignInOutput>;
  confirmMfa: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export type AuthContextValue = AuthState & AuthActions;

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false);

  const isAuthenticated = user !== null;

  // Check for existing session on mount
  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const email =
          session.tokens?.idToken?.payload?.['email'] as string | undefined;
        setUser({
          userId: currentUser.userId,
          email: email ?? currentUser.username,
        });
      } catch {
        // Not signed in
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signUp = useCallback(
    async (params: {
      email: string;
      password: string;
      givenName: string;
      familyName: string;
    }) => {
      const result = await cognitoSignUp({
        username: params.email,
        password: params.password,
        options: {
          userAttributes: {
            email: params.email,
            name: `${params.givenName} ${params.familyName}`.trim(),
            given_name: params.givenName,
            family_name: params.familyName,
          },
        },
      });
      return { isComplete: result.isSignUpComplete };
    },
    [],
  );

  const confirmSignUp = useCallback(
    async (email: string, code: string) => {
      await cognitoConfirmSignUp({ username: email, confirmationCode: code });
    },
    [],
  );

  const resendCode = useCallback(async (email: string) => {
    await resendSignUpCode({ username: email });
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInOutput> => {
      const result = await cognitoSignIn({ username: email, password });

      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const userEmail =
          session.tokens?.idToken?.payload?.['email'] as string | undefined;
        setUser({
          userId: currentUser.userId,
          email: userEmail ?? currentUser.username,
        });
        setMfaPending(false);
      } else if (
        result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' ||
        result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE'
      ) {
        setMfaPending(true);
      }

      return result;
    },
    [],
  );

  const confirmMfa = useCallback(async (code: string) => {
    const result = await cognitoConfirmSignIn({ challengeResponse: code });
    if (result.isSignedIn) {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const email =
        session.tokens?.idToken?.payload?.['email'] as string | undefined;
      setUser({
        userId: currentUser.userId,
        email: email ?? currentUser.username,
      });
      setMfaPending(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await cognitoSignOut();
    setUser(null);
    setMfaPending(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      mfaPending,
      signUp,
      confirmSignUp,
      resendCode,
      signIn,
      confirmMfa,
      signOut,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      mfaPending,
      signUp,
      confirmSignUp,
      resendCode,
      signIn,
      confirmMfa,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
