import { Helmet } from "react-helmet-async";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { TheRing } from "@/components/prologue/TheRing";
import { siteConfig, socialLinks, contactContent } from "@/lib/content";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: siteConfig.location,
      href: null,
    },
  ];

  const socialInfo = [
    { icon: Linkedin, label: "LinkedIn", href: socialLinks.linkedin },
    { icon: Github, label: "GitHub", href: socialLinks.github },
  ];

  return (
    <>
      <Helmet>
        <title>{`Contact | ${siteConfig.name}`}</title>
        <meta name="description" content={contactContent.description} />
      </Helmet>
      <Layout>
        <section className="pt-32 md:pt-44 pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading as="h1" title={contactContent.headline} subtitle={contactContent.description} />

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                  <TheRing ignited className="h-20 w-20 shrink-0 drop-shadow-[0_10px_20px_hsl(0_0%_0%/0.8)]" />
                  <div>
                    <p className="font-display text-xl font-semibold leading-snug tracking-[0.02em] text-gold">
                      Looking forward to hearing from you!
                    </p>
                    <p className="mt-1.5 italic text-bone-dim">I typically respond within 24-48 hours.</p>
                  </div>
                </div>

                <div>
                  <h2 className="credit text-[0.7rem] text-gold">Contact Information</h2>
                  <dl className="mt-5">
                    {contactInfo.map((item) => (
                      <div key={item.label} className="flex items-center gap-4 border-b border-gold-dim/40 py-4 first:border-t">
                        <item.icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                        <dt className="credit w-24 shrink-0 text-[0.62rem] text-bone-dim">{item.label}</dt>
                        <dd className="min-w-0 text-lg text-bone">
                          {item.href ? (
                            <a href={item.href} className="underline decoration-gold-dim hover:text-gold-bright">
                              {item.value.includes("@") ? (
                                <>
                                  {item.value.split("@")[0]}
                                  <wbr />
                                  <span className="whitespace-nowrap">@{item.value.split("@")[1]}</span>
                                </>
                              ) : (
                                item.value
                              )}
                            </a>
                          ) : (
                            item.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h2 className="credit text-[0.7rem] text-gold">Connect With Me</h2>
                  <div className="mt-5 flex gap-3">
                    {socialInfo.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid h-12 w-12 place-items-center rounded-full text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold-dim))] transition-[color,box-shadow] hover:text-gold-bright hover:shadow-[inset_0_0_0_1px_hsl(var(--gold))]"
                      >
                        <social.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
