import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_for_build';

export const stripe = new Stripe(apiKey, {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});

export const PLATFORM_COMMISSION_PERCENT = parseInt(
  process.env.PLATFORM_COMMISSION_PERCENT || '15',
  10
);

