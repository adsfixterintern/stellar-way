import SingleHero from '@/components/shared/SingleHero';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div>
      {/* ১. হিরো সেকশন - যা পেজের সাথে সামঞ্জস্যপূর্ণ */}
      <SingleHero
        isCenter={true}
        subtitle="Legal"
        title="Privacy Policy"
        description="At Savory Nest, we value your privacy. Learn how we collect, use, and protect your personal data."
        buttonTitle="Back to Home"
        buttonLink="/"
      />

      {/* ২. কন্টেন্ট সেকশন */}
      <div className="bg-white py-16 px-6 sm:px-12 lg:px-24 font-sans text-gray-800">
        <div className="max-w-4xl mx-auto border border-gray-100 p-10 rounded-3xl ">
          <h1 className="text-3xl font-black uppercase mb-4 flex items-center gap-3 border-b-4 border-[#1A4E11] inline-block">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 font-bold mb-10 uppercase tracking-widest italic">
            Last Updated: March 28, 2026
          </p>

          <section className="space-y-10">
            {/* Section 1 */}
            <div className="group">
              <h2 className="text-lg font-black text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#1A4E11]">01.</span> Information We Collect
              </h2>
              <p className="leading-relaxed text-gray-600 text-sm">
                When you use Savory Nest, we collect personal information such as your name, email address, phone number, and delivery address to process your food orders and provide a seamless experience.
              </p>
            </div>

            {/* Section 2 */}
            <div className="group">
              <h2 className="text-lg font-black text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#1A4E11]">02.</span> How We Use Your Data
              </h2>
              <ul className="list-disc ml-6 space-y-3 text-gray-600 text-sm">
                <li className="hover:text-[#1A4E11] transition-colors">To process secure payments via SSLCommerz or Stripe.</li>
                <li className="hover:text-[#1A4E11] transition-colors">To track and update your real-time delivery status.</li>
                <li className="hover:text-[#1A4E11] transition-colors">To send automated order confirmations and essential updates.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="group">
              <h2 className="text-lg font-black text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#1A4E11]">03.</span> Data Security
              </h2>
              <p className="leading-relaxed text-gray-600 text-sm">
                We implement industry-standard security protocols to protect your sensitive data. Your payment details are fully encrypted and never stored directly on our servers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;