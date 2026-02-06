import { BackgroundEffects } from '@/components/landing/BackgroundEffects';
import { Navbar } from '@/components/landing/Navbar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-300">
            <BackgroundEffects />
            <Navbar />

            <div className="flex pt-16">
                <DocsSidebar />
                <main className="flex-1 lg:pl-64 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
