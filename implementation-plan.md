# Text-Underlay Implementation Plan

## Status Legend
- [ ]Completed
- 🟡 In Progress
- ❌ Blocked

## 1. Environment Setup

- 🟡 Create a `.env.local` file with the necessary variables
  ```
  # Supabase - Required
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

  # Stripe - For payment processing
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
  STRIPE_SECRET_KEY=your_stripe_secret_key
  STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
  ```

## 2. Supabase Setup

- [ ]Create a Supabase account
- [ ]Create a new project
- [ ]Set up authentication methods (email/password, social logins)
- [ ]Create necessary database tables:
  - [ ]Users table (extended from auth.users)
  - [ ]Images table (for storing image metadata)
  - [ ]Subscriptions table (for Stripe integration)
  - [ ]Notifications table (for in-app notifications)
- [ ]Copy the Supabase URL and anon key to your `.env.local` file

## 3. Stripe Integration

- [ ] Create a Stripe account
- [ ] Set up products/prices for your subscription tiers
- [ ] Configure webhook endpoints for handling subscription events
- [ ] Add the Stripe keys to your `.env.local` file

## 4. Notification System with Supabase

- [ ]Use Supabase's real-time subscriptions for notifications
- [ ]Create a notifications table in your database
- [ ]Implement client-side subscription to notification changes
- [ ]Add UI components for displaying notifications

## 5. Code Implementation

- [ ] Database schema:
  - [ ] Create tables in Supabase
  - [ ] Set up row-level security policies
- [ ] Authentication flows:
  - [ ] Sign up
  - [ ] Sign in
  - [ ] Password reset
- [ ] Subscription handling:
  - [ ] Create subscription plans
  - [ ] Handle upgrades/downgrades
  - [ ] Process webhooks
- [ ] Core functionality:
  - [ ] Image upload and processing with Supabase Storage
  - [ ] Text overlay/underlay features
  - [ ] User dashboard

  - [ ] Build notification UI components
  - [ ] Handle notification preferences

## 6. Fix Firebase References

- [ ] Remove any Firebase initialization code
- [ ] Remove or update components that reference Firebase
- [ ] Remove the Firebase service worker reference causing the 404 error

## 7. Testing

- [ ] Test authentication flows
- [ ] Test subscription processes
- [ ] Test core functionality
- [ ] Test real-time notifications
- [ ] Perform cross-browser testing

## 8. Deployment

- [ ] Configure production environment variables
- [ ] Deploy to your hosting provider
- [ ] Set up monitoring and error tracking
