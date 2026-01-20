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

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div> */}
            
            <div className="max-w-5xl mx-auto text-center py-20">
              <p className="text-2xl md:text-3xl text-muted-foreground">Stay tuned</p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Projects;
