import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig, socialLinks, navLinks } from "@/lib/content";

/** The footer as end credits: centred, one line at a time, gold rules between. */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { href: socialLinks.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: socialLinks.github, icon: Github, label: "GitHub" },
    { href: socialLinks.email, icon: Mail, label: "Email" },
  ];

  return (
    <footer className="mt-20 text-center">
      <div className="gold-rule opacity-70" aria-hidden="true" />
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <Link to="/" className="gilded text-2xl md:text-3xl font-semibold uppercase tracking-[0.14em]">
          {siteConfig.name}
        </Link>

        <nav aria-label="Footer" className="mt-12">
          <h2 className="credit text-[0.66rem] text-gold">Navigation</h2>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href} className="whitespace-nowrap">
                <Link to={link.href} className="font-display tracking-[0.06em] text-bone-dim transition-colors hover:text-gold-bright">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12">
          <h2 className="credit text-[0.66rem] text-gold">Connect</h2>
          <div className="mt-5 flex justify-center gap-3">
            {socialIcons.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold-dim))] transition-[color,box-shadow] hover:text-gold-bright hover:shadow-[inset_0_0_0_1px_hsl(var(--gold))]"
                aria-label={social.label}
              >
                <social.icon size={17} strokeWidth={1.5} />
              </a>
            ))}
          </div>
          <p className="mt-5 italic text-bone-dim">{siteConfig.location}</p>
        </div>

        <p className="credit mt-16 text-[0.6rem] text-bone-dim">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
