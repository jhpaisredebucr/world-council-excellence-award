import Link from 'next/link';

export const metadata = {
  title: "Refund Policy - WCEA",
  description: "Refund Policy for WCEA - Learn about our refund terms and conditions.",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-green-700">
                <strong>Our Commitment:</strong> We want you to be satisfied with your WCEA membership. 
                This policy outlines our refund terms to ensure transparency and fairness.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. General Refund Policy</h2>
            <p className="text-gray-600 mb-6">
              WCEA offers refunds under specific conditions outlined in this policy. All refund 
              requests must be submitted in writing through our support channels.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. 30-Day Money-Back Guarantee</h2>
            <p className="text-gray-600 mb-4">
              New members are eligible for a full refund within 30 days of their initial purchase, 
              provided they meet the following conditions:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>The request is made within 30 days of the initial purchase date</li>
              <li>No more than 10% of the service features have been used</li>
              <li>No violations of our Terms of Service have occurred</li>
              <li>The account is in good standing</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Membership Subscriptions</h2>
            <p className="text-gray-600 mb-4">
              For monthly and annual subscription renewals:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Monthly renewals: Refund requests must be made within 7 days of renewal</li>
              <li>Annual renewals: Refund requests must be made within 30 days of renewal</li>
              <li>Pro-rated refunds are not available for partially used periods</li>
              <li>Cancellation prevents future charges but doesn't refund current period</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Digital Products and Services</h2>
            <p className="text-gray-600 mb-6">
              Due to the nature of digital products and services, refunds are only available 
              within 14 days of purchase if the product is defective or not as described.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Non-Refundable Items</h2>
            <p className="text-gray-600 mb-4">
              The following items are non-refundable:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Setup fees and one-time processing charges</li>
              <li>Third-party services integrated through our platform</li>
              <li>Custom development or consulting services</li>
              <li>Accounts terminated for Terms of Service violations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. How to Request a Refund</h2>
            <p className="text-gray-600 mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 mb-6 text-gray-600">
              <li>Contact our support team at refunds@wcea.com</li>
              <li>Include your account information and reason for refund</li>
              <li>Provide proof of purchase (order ID, receipt)</li>
              <li>Allow 5-7 business days for processing</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Refund Process</h2>
            <p className="text-gray-600 mb-4">
              Once your refund request is approved:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Refunds are processed back to the original payment method</li>
              <li>Processing time is typically 5-10 business days</li>
              <li>You will receive email confirmation when processed</li>
              <li>Account access will be terminated upon refund completion</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Chargebacks</h2>
            <p className="text-gray-600 mb-6">
              If you initiate a chargeback with your bank or credit card company without first 
              contacting us, your account will be immediately suspended and may be terminated. 
              We reserve the right to dispute chargebacks and recover associated costs.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Policy Changes</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify this refund policy at any time. Changes will be 
              effective immediately upon posting on our website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For refund-related questions or requests, please contact us:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-600">Email: refunds@wcea.com</p>
              <p className="text-gray-600">Support: support@wcea.com</p>
              <p className="text-gray-600">Response Time: 24-48 hours</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <p className="text-yellow-700">
                <strong>Important Note:</strong> This refund policy is subject to our Terms of Service 
                and Privacy Policy. By using our service, you agree to these terms.
              </p>
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
