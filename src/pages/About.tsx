import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { SkillsGrid } from "@/components/about/SkillsGrid";
import { Timeline } from "@/components/about/Timeline";
import { siteConfig, aboutContent } from "@/lib/content";

const About = () => {
  return (
    <>
      <Helmet>
        <title>{`About | ${siteConfig.name}`}</title>
        <meta name="description" content={aboutContent.intro.join(" ")} />
      </Helmet>
      <Layout>
        <section className="pt-32 md:pt-44 pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading as="h1" title={aboutContent.headline} />

            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <figure className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="gold-frame p-3">
                  <img src="/family_photo.jpg" alt="Family" className="block w-full object-cover" />
                </div>
              </figure>

              <div className="lg:col-span-7">
                <div className="max-w-[65ch] space-y-6 text-[1.12rem] leading-[1.85] text-bone">
                  {aboutContent.intro.map((paragraph, index) => (
                    <p key={index}>
                      {index === 0 ? (
                        <>
                          <span className="gilt-initial float-left mr-3 mt-[calc(0.375rem-0.2em)] pt-[0.2em] font-display text-[4.4rem] font-semibold leading-[0.78]">
                            {paragraph.charAt(0)}
                          </span>
                          {paragraph.slice(1)}
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
                <div className="my-10 flex items-center gap-3" aria-hidden="true">
                  <span className="gold-rule flex-1" />
                  <span className="h-2.5 w-2.5 rounded-full shadow-[inset_0_0_0_1.5px_hsl(var(--gold))]" />
                  <span className="gold-rule flex-1" />
                </div>
                <div className="max-w-[65ch] space-y-6 text-[1.12rem] leading-[1.85] text-bone-dim">
                  {aboutContent.bio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-36 max-w-5xl">
              <SectionHeading title="Skills & Technologies" subtitle="Technologies I work with to build amazing products" />
              <SkillsGrid />
            </div>

            <div className="mx-auto mt-36 max-w-5xl">
              <SectionHeading title="Experience & Journey" subtitle="Milestones that shaped my career" />
              <Timeline />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
