import Link from 'next/link';

export const metadata = {
  title: "Privacy Policy - WCEA",
  description: "Privacy Policy for WCEA - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support. This may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials and authentication data</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Profile information and preferences</li>
              <li>Communications with our support team</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent security incidents</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Payment processors for transaction processing</li>
              <li>Service providers who assist in operating our platform</li>
              <li>When required by law or to protect our rights</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Access and update your personal information</li>
              <li>Delete your account and personal data</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-6">
              We use cookies and similar tracking technologies to track activity on our service and 
              hold certain information. You can instruct your browser to refuse all cookies or to 
              indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our service is not intended for children under 18. We do not knowingly collect personal 
              information from children under 18.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. International Transfers</h2>
            <p className="text-gray-600 mb-6">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-600">Email: privacy@wcea.com</p>
              <p className="text-gray-600">Address: [Your Business Address]</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
