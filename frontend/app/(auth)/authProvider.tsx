'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Authenticator,
  AuthenticatorProps,
  Radio,
  RadioGroupField,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    const { route } = useAuthenticator((context) => [context.route]);

    const titles: Record<string, { title: string; subtitle: string }> = {
      signIn: {
        title: 'Welcome Back',
        subtitle: 'Enter your credentials to access your account.',
      },
      signUp: {
        title: 'Create an Account',
        subtitle: 'Sign up to explore, lease, or manage properties.',
      },
      confirmSignUp: {
        title: 'Verify Your Email',
        subtitle: 'Enter the 6-digit confirmation code sent to your email.',
      },
      forgotPassword: {
        title: 'Reset Password',
        subtitle: 'Enter your email to receive recovery instructions.',
      },
      confirmResetPassword: {
        title: 'Set New Password',
        subtitle: 'Enter the verification code and your new password.',
      },
    };

    const current = titles[route] || {
      title: 'Authentication',
      subtitle: 'Please complete the step below to proceed.',
    };

    return (
      <div className="mb-6 space-y-1 text-left">
        <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
          {current.title}
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed">{current.subtitle}</p>
      </div>
    );
  },

  SignIn: {
    Footer() {
      const { toSignUp, toForgotPassword } = useAuthenticator();
      return (
        <div className="mt-5 space-y-2 text-center text-xs">
          <button
            type="button"
            onClick={toForgotPassword}
            className="text-muted-foreground hover:text-secondary cursor-pointer transition-colors"
          >
            Forgot your password?
          </button>
          <p className="text-muted-foreground pt-1">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={toSignUp}
              className="text-secondary ml-1 cursor-pointer font-bold hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      );
    },
  },

  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="I want to join as a"
            name="custom:role"
            errorMessage={validationErrors?.['custom:role']}
            hasError={!!validationErrors?.['custom:role']}
            isRequired
          >
            <Radio value="tenant">
              <Users aria-hidden="true" className="text-secondary size-5 shrink-0" />
              <span>Tenant</span>
            </Radio>
            <Radio value="manager">
              <Building2 aria-hidden="true" className="text-secondary size-5 shrink-0" />
              <span>Property Manager</span>
            </Radio>
          </RadioGroupField>
        </>
      );
    },

    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <div className="mt-5 text-center text-xs">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={toSignIn}
              className="text-secondary ml-1 cursor-pointer font-bold hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      );
    },
  },

  ConfirmSignUp: {
    Footer() {
      const { toSignIn, resendCode } = useAuthenticator();
      return (
        <div className="mt-5 space-y-2 text-center text-xs">
          <button
            type="button"
            onClick={resendCode}
            className="text-muted-foreground hover:text-secondary cursor-pointer transition-colors"
          >
            Didn&apos;t receive a code? <span className="text-secondary font-semibold">Resend</span>
          </button>
          <p className="text-muted-foreground pt-1">
            Back to{' '}
            <button
              type="button"
              onClick={toSignIn}
              className="text-secondary ml-1 cursor-pointer font-bold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      );
    },
  },
};

const formFields: AuthenticatorProps['formFields'] = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Email Address',
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
      label: 'Email Address',
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: 'Create a password (min. 8 characters)',
      label: 'Password',
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: 'Confirm your password',
      label: 'Confirm Password',
      isRequired: true,
    },
  },
  confirmSignUp: {
    confirmation_code: {
      placeholder: 'Enter 6-digit confirmation code',
      label: 'Verification Code',
      isRequired: true,
    },
  },
  forgotPassword: {
    username: {
      placeholder: 'Enter your registered email address',
      label: 'Email Address',
      isRequired: true,
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: 'Enter 6-digit code',
      label: 'Verification Code',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your new password',
      label: 'New Password',
      isRequired: true,
    },
  },
};

export default function Auth({ children }: { children: React.ReactNode }) {
  const { user } = useAuthenticator((context) => [context.user]);

  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage = pathname.startsWith('/managers') || pathname.startsWith('/tenants');

  useEffect(() => {
    if (user && isAuthPage) {
      router.push('/');
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  if (isDashboardPage && user) {
    return <>{children}</>;
  }

  return (
    <div className="text-foreground relative flex min-h-screen w-full flex-col overflow-hidden bg-zinc-950">
      {/* Full Screen Background Image with Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Image
          src="/landing-splash.jpg"
          alt="Luxury modern property backdrop"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center opacity-60 transition-transform duration-1000 ease-out dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60 dark:from-black/95 dark:via-black/85 dark:to-black/80" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-stretch justify-between gap-6 p-0 lg:flex-row lg:p-8 xl:gap-12">
        {/* Left-Aligned Auth Card (Roughly 1/3 width on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card/95 border-border/80 flex min-h-screen w-full shrink-0 flex-col justify-center rounded-none border-0 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 lg:min-h-0 lg:w-[430px] lg:justify-between lg:self-center lg:rounded-3xl lg:border xl:w-[470px]"
        >
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            {/* Top Brand Header */}
            <div className="border-border/60 mb-2 flex items-center justify-between border-b pb-6">
              <Link href="/" className="inline-flex items-center gap-2.5" scroll={false}>
                <div className="bg-secondary flex size-8 items-center justify-center rounded-xl p-1.5 shadow-xs">
                  <Image src="/logo.svg" alt="Rentiful" width={22} height={22} className="size-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">
                  RENT<span className="text-secondary font-light">IFUL</span>
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <ThemeToggle className="size-8" />
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-medium lg:hidden"
                >
                  <ArrowLeft className="size-3.5" /> Home
                </Link>
              </div>
            </div>

            {/* Amplify Authenticator Form */}
            <div className="w-full min-w-0 pt-2">
              <Authenticator
                initialState={pathname.includes('signup') ? 'signUp' : 'signIn'}
                components={components}
                formFields={formFields}
              >
                {() => <>{children}</>}
              </Authenticator>
            </div>
          </div>

          {/* Security Guarantee Bottom */}
          <div className="border-border/60 text-muted-foreground mx-auto mt-8 flex w-full max-w-md items-center justify-center gap-2 border-t pt-4 text-[11px] lg:max-w-none">
            <Lock className="text-secondary size-3" />
            <span>End-to-end encrypted · AWS Cognito Secure Auth</span>
          </div>
        </motion.div>

        {/* Right Section (Borderless Content on Background) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden min-w-0 flex-1 flex-col items-center justify-between px-4 py-6 text-white lg:flex xl:px-8"
        >
          {/* Top Right Navigation */}
          <div className="flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 shadow-lg backdrop-blur-md">
              <Sparkles className="text-secondary size-3.5 animate-pulse" />
              <span>Next-Gen Real Estate OS</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>

          {/* Middle Content Showcase */}
          <div className="my-auto w-full max-w-xl space-y-6 py-8 text-center">
            <h1 className="text-3xl leading-tight font-black tracking-tight text-white xl:text-4xl 2xl:text-5xl">
              Discover, Lease & Manage <br />
              <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
                Verified Homes Seamlessly
              </span>
            </h1>

            <p className="text-sm leading-relaxed font-normal text-white/80 xl:text-base">
              Experience the new standard of residential leasing. Enjoy instant digital
              applications, transparent security terms, and frictionless communication between
              renters and owners.
            </p>

            {/* 3 Glassmorphic Feature Badges */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-md">
                <Building2 className="text-secondary mx-auto mb-2 size-5" />
                <h4 className="text-xs font-bold text-white">100% Verified</h4>
                <p className="mt-0.5 text-[11px] text-white/70">
                  Accurate photos and inspected residences.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-md">
                <KeyRound className="mx-auto mb-2 size-5 text-amber-400" />
                <h4 className="text-xs font-bold text-white">Instant Apply</h4>
                <p className="mt-0.5 text-[11px] text-white/70">
                  Fast digital tenant profiles & leases.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-md">
                <ShieldCheck className="mx-auto mb-2 size-5 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">Zero Hidden Fees</h4>
                <p className="mt-0.5 text-[11px] text-white/70">
                  Transparent deposits and monthly rent.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Live Metrics & Social Proof */}
          <div className="flex w-full items-center justify-between border-t border-white/15 pt-6 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="flex size-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-rose-500 text-[10px] font-bold text-white">
                  JD
                </div>
                <div className="flex size-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-amber-500 text-[10px] font-bold text-white">
                  ST
                </div>
                <div className="flex size-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-blue-500 text-[10px] font-bold text-white">
                  MR
                </div>
              </div>
              <span className="font-semibold text-white">12,000+ happy tenants</span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-white">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span>4.9 / 5</span>
              <span className="font-normal text-white/60">tenant rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
