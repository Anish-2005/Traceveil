import { PageHeader, PageLayout } from '@/components/shared';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageLayout>
            <PageHeader title="Documentation" subtitle="Integration & Architecture" />
            <div className="flex">
                <DocsSidebar />
                <main id="main-content" className="flex-1 lg:pl-72 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-5xl mx-auto px-5 py-8 lg:px-10 lg:py-12">
                        {children}
                    </div>
                </main>
            </div>
        </PageLayout>
    );
}
