# Text-Underlay Implementation Plan

## Status Legend
- ✅ Completed
- 🟡 In Progress
- ❌ Blocked

## 1. Environment Setup

- ✅ Create a `.env.local` file with the necessary variables
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

- ✅ Create a Supabase account
- ✅ Create a new project
- ✅ Set up authentication methods (Google login)
- ✅ Create necessary database tables:
  - ✅ Users table (extended from auth.users via profiles)
  - ✅ Images table (for storing image metadata)
  - ✅ Subscriptions table (for Stripe integration)
  - ✅ Notifications table (for in-app notifications)
- ✅ Copy the Supabase URL and anon key to your `.env.local` file

## 3. Stripe & Subscription Integration

- 🟡 Create a Stripe account
- 🟡 Set up products/prices for subscription tiers
- 🟡 Configure webhook endpoints for subscription events
- 🟡 Add Stripe keys to `.env.local`
- [ ] Create subscription plans in Stripe
- [ ] Handle upgrades/downgrades
- [ ] Process webhooks for subscription changes

## 4. Notification System

- 🟡 Use Supabase real-time for notifications
- 🟡 Create notifications table in Supabase
- [ ] Implement client-side subscription to notification changes
- [ ] Build notification UI components
- [ ] Handle notification preferences

## 5. Code Implementation

- Database schema:
  - Create tables in Supabase
  - Set up row-level security policies
- Authentication flows:
  - Sign up
  - Sign in
- Core functionality:
  - Image upload and processing with Supabase Storage
  - Implement text-underlay effect (CSS/JS logic)
  - Add UI for user text input and overlay selection
  - Integrate text-underlay with uploaded images
  - User dashboard for managing images and subscriptions

## 6. Fix Firebase References

- Remove any Firebase initialization code
- Remove or update components that reference Firebase
- Remove the Firebase service worker reference causing the 404 error

## 7. Testing & CI

- [ ] Test authentication flows
- [ ] Test subscription processes
- [ ] Test core functionality (image upload, text-underlay)
- [ ] Test real-time notifications
- [ ] Perform cross-browser testing
- [ ] Add automated tests (unit/integration)
- [ ] Set up CI for PRs and main branch

## 8. Deployment

- [ ] Configure production environment variables
- [ ] Deploy preview/staging environment
- [ ] Deploy to production hosting provider
- [ ] Set up monitoring and error tracking
