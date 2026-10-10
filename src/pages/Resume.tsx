import { Helmet } from "react-helmet-async";
import { Download, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/content";

const Resume = () => {
  return (
    <>
      <Helmet>
        <title>{`Resume | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content={`View and download ${siteConfig.name}'s professional resume.`}
        />
      </Helmet>
      <Layout>
        <section className="pt-32 md:pt-44 pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              as="h1"
              title="Resume"
              subtitle="View my professional experience and qualifications"
            />

            <div className="mx-auto max-w-4xl">
              <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild variant="hero" size="lg">
                  <a href={siteConfig.resumeUrl} download>
                    <Download />
                    Download PDF
                  </a>
                </Button>
                <Button asChild variant="heroOutline" size="lg">
                  <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    Open in New Tab
                  </a>
                </Button>
              </div>

              <div className="gold-frame mx-auto max-w-3xl p-3 md:p-4">
                <div className="relative aspect-[8.5/11] w-full overflow-hidden bg-bone">
                  <embed
                    src={`${siteConfig.resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    type="application/pdf"
                    className="h-full w-full"
                    title="Resume PDF"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Resume;
