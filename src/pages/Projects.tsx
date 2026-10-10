import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { siteConfig, projects } from "@/lib/content";

const Projects = () => {
  return (
    <>
      <Helmet>
        <title>{`Projects | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content={`Explore ${siteConfig.name}'s portfolio of software engineering and data science projects.`}
        />
      </Helmet>
      <Layout>
        <section className="pt-32 md:pt-44 pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              as="h1"
              title="Featured Projects"
              subtitle="A collection of projects showcasing impactful technical solutions to real-world problems."
            />

            <div className="mx-auto flex max-w-6xl flex-col gap-32 md:gap-44">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Projects;
