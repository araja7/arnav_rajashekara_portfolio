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
        <meta name="description" content={aboutContent.intro.join(" ")} />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header - title only*/}
            <SectionHeading title={aboutContent.headline} />

            {/* Family photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center mb-12"
            >
              <img
                src="/family_photo.jpg"
                alt="Family"
                className="rounded-lg object-cover w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg"
              />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start mb-20"
            >
              <div className="flex-1 min-w-0">
                <div className="prose prose-lg dark:prose-invert text-left max-w-2xl">
                  {aboutContent.intro.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="prose prose-lg dark:prose-invert text-left max-w-2xl">
                  {aboutContent.bio.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
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
