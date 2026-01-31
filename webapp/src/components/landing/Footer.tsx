import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-white/[0.06] py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <img src="/traceveil-logo.svg" alt="Traceveil" className="w-8 h-8" />
                            <span className="font-bold text-white">Traceveil</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            AI-powered fraud detection and threat intelligence platform for modern enterprises.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {['Features', 'Pricing', 'Security', 'Enterprise'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {['Privacy', 'Terms', 'Cookies', 'Compliance'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">© 2026 Traceveil. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map((social) => (
                            <a
                                key={social}
                                href="#"
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
