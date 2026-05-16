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
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Featured Projects"
              subtitle="A collection of projects showcasing impactful technical solutions to real-world problems."
            />

            <div className="flex flex-col gap-10 max-w-3xl mx-auto">
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
