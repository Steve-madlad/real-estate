import { Amplify } from 'aws-amplify';

import {
  Authenticator,
  AuthenticatorProps,
  Heading,
  useAuthenticator,
  View,
} from '@aws-amplify/ui-react';

if (
  !process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ||
  !process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
) {
  throw new Error('Missing Cognito configuration in environment variables');
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
});

const components: AuthenticatorProps['components'] = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading level={3} className="text-2xl! font-bold!">
          RENT<span className="text-secondary-500 hover:text-primary-300! font-light">IFUL</span>
        </Heading>
        <p className="text-muted-foreground mt-2">
          <span className="font-bold">WELCOME! </span>Please Sign in to continue
        </p>
      </View>
    );
  },
};

const formFields: AuthenticatorProps['formFields'] = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Email',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your password',
      label: 'Password',
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: 'Choose a username',
      label: 'Username',
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: 'Enter your email address',
      label: 'Email',
      isRequired: true,
    },
    password: {
      placeholder: 'Create a password',
      label: 'Password',
      isRequired: true,
    },
    confirm_password: {
      placeholder: 'Confirm your password',
      label: 'Confirm Password',
      isRequired: true,
    },
  },
};

export default function Auth({ children }: { children: React.ReactNode }) {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <div className="h-full">
      <Authenticator components={components} formFields={formFields}>
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
}
