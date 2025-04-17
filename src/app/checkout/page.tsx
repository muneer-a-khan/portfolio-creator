'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    // In a real implementation, this would call your API endpoint
    // to create a Stripe Checkout session
    try {
      // Mock for now - in real implementation would redirect to Stripe 
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      console.error('Error during checkout:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
              InstantDevPortfolios
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Complete Your Purchase
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Get instant access to the portfolio creator
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between">
                <span className="text-lg font-medium">Portfolio Creator</span>
                <span className="text-lg font-medium">$10.00</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                One-time purchase with lifetime access
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>$10.00</span>
              </div>
            </div>

            <div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>

            <div className="text-sm text-center text-gray-500">
              <p>
                By proceeding, you agree to our{' '}
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="text-sm">
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} InstantDevPortfolios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 