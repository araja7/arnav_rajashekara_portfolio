import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
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
        <meta name="description" content={aboutContent.intro} />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <SectionHeading
              title={aboutContent.headline}
              subtitle={aboutContent.intro}
            />

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl mx-auto mb-20"
            >
              <div className="prose prose-lg dark:prose-invert mx-auto">
                {aboutContent.bio.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4 indent-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Skills Section */}
            <div className="mb-20">
              <SectionHeading
                title="Skills & Technologies"
                subtitle="Technologies I work with to build amazing products"
              />
              <div className="max-w-4xl mx-auto">
                <SkillsGrid />
              </div>
            </div>

            {/* Timeline Section */}
            <div>
              <SectionHeading
                title="Experience & Journey"
                subtitle="Milestones that shaped my career"
              />
              <div className="max-w-4xl mx-auto">
                <Timeline />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
