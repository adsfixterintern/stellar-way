import SingleHero from '@/components/shared/SingleHero';
import React from 'react';

const TermsOfService = () => {
  return (
    <div>
      {/* ১. হিরো সেকশন - লিগ্যাল থিমের সাথে মিল রেখে */}
      <SingleHero
        isCenter={true}
        subtitle="Legal"
        title="Terms of Service"
        description="Please read these terms carefully before using Savory Nest. They outline your rights and our commitment to you."
        buttonTitle="Back to Home"
        buttonLink="/"
      />

      {/* ২. মেইন কন্টেন্ট সেকশন */}
      <div className="bg-white py-16 px-6 sm:px-12 lg:px-24 font-sans text-gray-800">
        <div className="max-w-4xl mx-auto border border-gray-100 p-10 rounded-3xl ">
          <h1 className="text-3xl font-black uppercase mb-8 text-[#1A4E11] tracking-tighter">
            Terms of Service
          </h1>

          <div className="space-y-10">
            {/* Section 1 */}
            <section className="group">
              <h2 className="text-lg font-black border-l-4 border-[#1A4E11] pl-4 mb-4 uppercase tracking-wide text-gray-900 group-hover:bg-gray-50 transition-colors py-1">
                01. Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-7 text-sm pl-5">
                By accessing and placing an order on Savory Nest, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our services.
              </p>
            </section>

            {/* Section 2 */}
            <section className="group">
              <h2 className="text-lg font-black border-l-4 border-[#1A4E11] pl-4 mb-4 uppercase tracking-wide text-gray-900 group-hover:bg-gray-50 transition-colors py-1">
                02. Order & Payments
              </h2>
              <p className="text-gray-600 leading-7 text-sm pl-5">
                All orders are subject to availability. Payments must be made in full through our integrated gateways (SSLCommerz or Stripe). Savory Nest reserves the right to cancel orders in case of technical errors or incorrect pricing.
              </p>
            </section>

            {/* Section 3 */}
            <section className="group">
              <h2 className="text-lg font-black border-l-4 border-[#1A4E11] pl-4 mb-4 uppercase tracking-wide text-gray-900 group-hover:bg-gray-50 transition-colors py-1">
                03. Delivery Policy
              </h2>
              <p className="text-gray-600 leading-7 text-sm pl-5">
                Delivery times are estimates. We strive to deliver your food while it's fresh, but external factors like traffic or weather may cause delays. Once an order status is marked as <span className="font-bold text-[#1A4E11]">"On-the-way"</span>, cancellations are not permitted.
              </p>
            </section>

            {/* Section 4 - Additional Clause */}
            <section className="group">
              <h2 className="text-lg font-black border-l-4 border-[#1A4E11] pl-4 mb-4 uppercase tracking-wide text-gray-900 group-hover:bg-gray-50 transition-colors py-1">
                04. User Conduct
              </h2>
              <p className="text-gray-600 leading-7 text-sm pl-5">
                Users are expected to provide accurate information (address and phone number) to ensure successful delivery. Misuse of our platform or fraudulent activities will lead to account suspension.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-[2px]">
              © 2026 Savory Nest - All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;