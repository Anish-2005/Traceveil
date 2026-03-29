import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface DocHeroProps {
  badge?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function DocHero({ badge, icon: Icon, title, description, actions }: DocHeroProps) {
  return (
    <header className="docs-hero scroll-reveal reveal-delay-100">
      {badge && <div className="docs-badge">{badge}</div>}
      <div className="flex items-center gap-3 mb-4">
        <div className="docs-icon-wrap">
          <Icon className="w-5 h-5 docs-accent-icon" />
        </div>
        <h1 className="docs-title">{title}</h1>
      </div>
      <p className="docs-subtitle">{description}</p>
      {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

interface DocSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocSection({ title, description, children }: DocSectionProps) {
  return (
    <section className="docs-section scroll-reveal reveal-delay-200">
      <div className="mb-5">
        <h2 className="docs-section-title">{title}</h2>
        {description && <p className="docs-section-description">{description}</p>}
      </div>
      {children}
    </section>
  );
}

interface DocCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  href?: string;
  children?: ReactNode;
}

export function DocCard({ icon: Icon, title, description, href, children }: DocCardProps) {
  const content = (
    <article className="docs-card group scroll-reveal-scale reveal-delay-300">
      {Icon && (
        <div className="docs-card-icon">
          <Icon className="w-4 h-4 docs-accent-icon" />
        </div>
      )}
      <h3 className="docs-card-title">{title}</h3>
      <p className="docs-card-description">{description}</p>
      {children}
    </article>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

interface DocCodeBlockProps {
  code: string;
  languageLabel?: string;
}

export function DocCodeBlock({ code, languageLabel }: DocCodeBlockProps) {
  return (
    <div className="docs-code scroll-reveal reveal-delay-300">
      {languageLabel && <div className="docs-code-label">{languageLabel}</div>}
      <pre className="docs-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface DocCalloutProps {
  title: string;
  tone?: 'info' | 'warning' | 'success';
  children: ReactNode;
}

export function DocCallout({ title, tone = 'info', children }: DocCalloutProps) {
  return (
    <aside className={`docs-callout docs-callout-${tone} scroll-reveal reveal-delay-300`}>
      <h4 className="docs-callout-title">{title}</h4>
      <div className="docs-callout-body">{children}</div>
    </aside>
  );
}

interface DocNavLinkProps {
  href: string;
  label: string;
}

export function DocNavLink({ href, label }: DocNavLinkProps) {
  return (
    <Link href={href} className="docs-nav-link scroll-reveal reveal-delay-300">
      <span>{label}</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
