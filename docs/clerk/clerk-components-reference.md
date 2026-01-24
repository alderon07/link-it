# Clerk Components Reference

A comprehensive guide to Clerk's component library for Next.js applications. This reference covers all available components for authentication, user management, organizations, billing, and control flow.

> **Source**: [Clerk Component Reference](https://clerk.com/docs/nextjs/reference/components/overview)  
> **Last Updated**: 2026-01-22

## Overview

Clerk offers a comprehensive suite of components designed to seamlessly integrate authentication and multi-tenancy into your application. With Clerk components, you can:

- Customize the appearance of authentication components and pages
- Manage the entire authentication flow to suit your specific needs
- Build robust SaaS applications with organization support

## Authentication Components

### `<SignIn />`
Pre-built sign-in component with customizable UI.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<SignUp />`
Pre-built sign-up component with customizable UI.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<GoogleOneTap />`
Google One Tap authentication component.

**Available for**: Astro, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<TaskChooseOrganization />`
Component for choosing an organization during authentication flow.

**Available for**: JS Frontend, Next.js, React, React Router, Remix, TanStack React Start

### `<Waitlist />`
Waitlist component for managing user signups.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

## User Components

### `<UserAvatar />`
Displays the user's avatar image.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<UserButton />`
User menu button with dropdown for profile, settings, and sign out.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<UserProfile />`
Complete user profile management component with customizable pages.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

## Organization Components

### `<CreateOrganization />`
Component for creating new organizations.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<OrganizationProfile />`
Organization profile management component with customizable pages.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<OrganizationSwitcher />`
Component for switching between organizations.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<OrganizationList />`
Component for listing all organizations.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

## Billing Components

### `<PricingTable />`
Display pricing plans in a table format.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<CheckoutButton />`
Button to initiate checkout process.

**Available for**: React, Next.js, Vue

### `<PlanDetailsButton />`
Button to view plan details.

**Available for**: React, Next.js, Vue

### `<SubscriptionDetailsButton />`
Button to view subscription details.

**Available for**: React, Next.js, Vue

## Control Components

Control components manage authentication-related behaviors in your application. They handle tasks such as:

- Controlling content visibility based on user authentication status
- Managing loading states during authentication processes
- Redirecting users to appropriate pages

Control components render at `<Loading />` and `<Loaded />` states for assertions on the Clerk object.

### `<AuthenticateWithRedirectCallback />`
Handles authentication redirect callbacks.

**Available for**: Astro, Chrome Extension, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<ClerkLoaded />`
Renders children only when Clerk has finished loading.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue, JS Frontend

### `<ClerkLoading />`
Renders children while Clerk is loading.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<ClerkDegraded />`
Renders children when Clerk is in degraded mode.

**Available for**: Next.js, React, React Router, Chrome Extension, Remix, TanStack React Start

### `<ClerkFailed />`
Renders children when Clerk has failed to load.

**Available for**: Next.js, React, React Router, Chrome Extension, Remix, TanStack React Start

### `<Protect />`
Protects content based on authentication and authorization rules.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<RedirectToSignIn />`
Redirects unauthenticated users to the sign-in page.

**Available for**: Chrome Extension, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<RedirectToSignUp />`
Redirects users to the sign-up page.

**Available for**: Chrome Extension, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<RedirectToTasks />`
Redirects users to the tasks page.

**Available for**: Chrome Extension, Next.js, Nuxt, React, React Router, TanStack React Start, Vue

### `<RedirectToUserProfile />`
Redirects users to their profile page.

**Available for**: Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<RedirectToOrganizationProfile />`
Redirects users to the organization profile page.

**Available for**: Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<RedirectToCreateOrganization />`
Redirects users to the create organization page.

**Available for**: Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<SignedIn />`
Renders children only when a user is authenticated. This is one of the most commonly used control components.

**Example**:
```tsx
<SignedIn>
  <UserButton />
</SignedIn>
```

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<SignedOut />`
Renders children only when a user is not authenticated.

**Example**:
```tsx
<SignedOut>
  <SignInButton />
</SignedOut>
```

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

## Unstyled Components

Unstyled components provide functionality without default styling, allowing for complete customization.

### `<SignInButton />`
Button that triggers the sign-in flow.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<SignInWithMetamaskButton />`
Button for signing in with MetaMask.

**Available for**: Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<SignUpButton />`
Button that triggers the sign-up flow.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

### `<SignOutButton />`
Button that signs out the current user.

**Available for**: Astro, Chrome Extension, Expo, Next.js, Nuxt, React, React Router, Remix, TanStack React Start, Vue

## Customization Guides

### Appearance Customization
Customize components with the `appearance` prop. This allows you to:
- Change colors, fonts, and styling
- Match your application's design system
- Create pixel art or custom themes

**Reference**: [Customize components with the `appearance` prop](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview)

### Localization
Localize components with the `localization` prop (experimental).

**Reference**: [Localize components with the `localization` prop](https://clerk.com/docs/guides/customizing-clerk/localization)

### Extending User Profile
Add custom pages to the `<UserProfile />` component.

**Reference**: [Add pages to the `<UserProfile />` component](https://clerk.com/docs/nextjs/guides/customizing-clerk/adding-items/user-profile)

### Extending Organization Profile
Add custom pages to the `<OrganizationProfile />` component.

**Reference**: [Add pages to the `<OrganizationProfile />` component](https://clerk.com/docs/nextjs/guides/customizing-clerk/adding-items/organization-profile)

## Branding

### Secured by Clerk Badge

By default, Clerk displays a **"Secured by Clerk"** badge on Clerk components.

> ⚠️ **Warning**: Removing the "Secured by Clerk" branding requires a [paid plan](https://clerk.com/pricing) for production use, but all features are free to use in development mode.

#### How to Remove Branding

1. In the Clerk Dashboard, navigate to your application's [**Settings**](https://dashboard.clerk.com/~/settings)
2. Under **Branding**, toggle on the **Remove "Secured by Clerk" branding** option

## Usage in Link-It

For Link-It specific usage examples and patterns, see:
- [Architecture Documentation](./architecture/index.md)
- [Tech Stack](./architecture/tech-stack.md)

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Discord Community](https://clerk.com/discord)
- [Clerk Support](https://clerk.com/support)
