import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p>
        Welcome to Black-white e-com website. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
      </p>

      <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
      <p>We collect personal and transactional information, including but not limited to:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Name, email address, phone number</li>
        <li>Shipping and billing address</li>
        <li>Payment information</li>
        <li>Order history and preferences</li>
        <li>Device and browsing data (cookies, IP address, etc.)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
      <p>We use your information for the following purposes:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Processing and fulfilling orders</li>
        <li>Providing customer support</li>
        <li>Personalizing your shopping experience</li>
        <li>Sending updates and promotional offers</li>
        <li>Ensuring website security and fraud prevention</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">3. Sharing of Information</h2>
      <p>We do not sell your personal data. However, we may share your information with:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Trusted third-party service providers (payment gateways, shipping partners, etc.)</li>
        <li>Legal authorities if required by law</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">4. Cookies & Tracking Technologies</h2>
      <p>We use cookies to enhance your experience and analyze website traffic. You can manage cookie settings in your browser.</p>

      <h2 className="text-xl font-semibold mt-4">5. Data Security</h2>
      <p>We implement industry-standard security measures to protect your personal data from unauthorized access.</p>

      <h2 className="text-xl font-semibold mt-4">6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Access, correct, or delete your personal data</li>
        <li>Opt-out of marketing communications</li>
        <li>Request details on data usage</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">7. Changes to This Policy</h2>
      <p>We may update this policy from time to time. The latest version will always be available on our website.</p>

      <h2 className="text-xl font-semibold mt-4">8. Contact Us</h2>
      <p>If you have any questions regarding this Privacy Policy, please contact us at <strong>support@black-white.com</strong>.</p>
    </div>
  );
};

export default PrivacyPolicy;
