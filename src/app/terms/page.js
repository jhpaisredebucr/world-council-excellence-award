import Link from 'next/link';

export const metadata = {
  title: "Terms of Service - WCEA",
  description: "Terms of Service for WCEA - Read our terms and conditions for using our platform.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-blue-700">
                <strong>Important:</strong> By accessing and using WCEA ("the Service"), you accept and agree 
                to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing or using our service, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, you may not access or use the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-6">
              WCEA provides a platform for health and wellness data management, progress tracking, 
              and personalized recommendations. The service includes member accounts, transaction 
              processing, and various administrative features.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              To use certain features of the service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-600 mb-4">
              You agree not to use the service to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Engage in fraudulent or deceptive practices</li>
              <li>Spam or send unsolicited communications</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Payments and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Regarding payments and refunds:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>All payments are processed through secure third-party payment processors</li>
              <li>You agree to provide accurate payment information</li>
              <li>Refunds are subject to our Refund Policy</li>
              <li>We reserve the right to modify pricing with notice</li>
              <li>Chargebacks may result in account suspension</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              The service and its original content, features, and functionality are owned by WCEA 
              and are protected by international copyright, trademark, and other intellectual 
              property laws. You may not modify, reproduce, distribute, or create derivative works 
              without our express written permission.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Privacy</h2>
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, 
              for any reason, including if you:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Breach these Terms of Service</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Violate the rights of others</li>
              <li>Fail to pay for services when due</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              In no event shall WCEA, its directors, employees, partners, agents, suppliers, or 
              affiliates be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including loss of profits, data, use, or other intangible losses, resulting 
              from your use of the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-6">
              The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations 
              or warranties of any kind, express or implied, regarding the operation or availability 
              of the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These Terms of Service shall be interpreted and governed by the laws of the jurisdiction 
              in which WCEA operates, without regard to conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify these terms at any time. If we make material changes, 
              we will notify you by email or by posting a notice on our site prior to the change 
              becoming effective.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-600">Email: legal@wcea.com</p>
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
