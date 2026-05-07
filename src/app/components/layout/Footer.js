import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img 
                                src="/images/logos/wcea.png" 
                                alt="WCEA Logo" 
                                className="w-8 h-8"
                            />
                            <h3 className="text-white text-lg font-semibold">
                                World Council Excellence Award
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering health and wellness through innovative data management and 
                            personalized recommendations for a better tomorrow.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link 
                                    href="/home" 
                                    className="hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/home/memberships" 
                                    className="hover:text-white transition-colors"
                                >
                                    Memberships
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/home/about" 
                                    className="hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/home/contacts" 
                                    className="hover:text-white transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link 
                                    href="/privacy" 
                                    className="hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/terms" 
                                    className="hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/refund-policy" 
                                    className="hover:text-white transition-colors"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} World Council Excellence Award. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <span className="text-gray-400 text-sm">
                                Compliance with GDPR, CCPA, and PIPEDA
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
