import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { PublicationCard } from "@/components/publications/PublicationCard";
import { publications, publicationsContent, siteConfig } from "@/lib/content";

const Publications = () => {
  return (
    <>
      <Helmet>
        <title>{`Publications | ${siteConfig.name}`}</title>
        <meta name="description" content={publicationsContent.subtitle} />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={publicationsContent.headline}
              subtitle={publicationsContent.subtitle}
            />

            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {publications.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Publications;
