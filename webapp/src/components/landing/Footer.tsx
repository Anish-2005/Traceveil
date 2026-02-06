import Link from 'next/link';
import { Github, Twitter, Linkedin, Disc } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-white/[0.05] bg-[#030712] py-16">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
                    {/* Brand */}
                    <div className="scroll-reveal max-w-sm">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-md blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="/traceveil-logo.svg"
                                    alt="Traceveil"
                                    className="relative h-8 w-8 transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight">Traceveil</span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Advanced threat detection platform for modern enterprises.
                            Built for scale, speed, and precision.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
                            <SocialLink icon={<Github className="w-5 h-5" />} href="#" />
                            <SocialLink icon={<Linkedin className="w-5 h-5" />} href="#" />
                            <SocialLink icon={<Disc className="w-5 h-5" />} href="#" />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16 md:gap-24 flex-wrap">
                        <div className="scroll-reveal reveal-delay-1">
                            <FooterColumn
                                title="Platform"
                                links={['Features', 'Integrations', 'Pricing', 'Changelog']}
                            />
                        </div>
                        <div className="scroll-reveal reveal-delay-2">
                            <FooterColumn
                                title="Resources"
                                links={['Documentation', 'API Reference', 'Community', 'Status']}
                            />
                        </div>
                        <div className="scroll-reveal reveal-delay-3">
                            <FooterColumn
                                title="Company"
                                links={['About', 'Careers', 'Contact', 'Legal']}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="scroll-reveal reveal-delay-4 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-600">
                        © 2026 Traceveil Inc. All rights reserved.
                    </p>

                    {/* System Status Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05]">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-400">
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
    return (
        <div>
            <h4 className="font-semibold text-white mb-4 text-sm">{title}</h4>
            <ul className="space-y-3 relative">
                {links.map((item) => (
                    <li key={item}>
                        <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{item}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a
            href={href}
            className="h-10 w-10 rounded-lg bg-white/[0.03] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
        >
            {icon}
        </a>
    );
}
