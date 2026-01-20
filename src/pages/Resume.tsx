import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Download, FileText, ExternalLink } from "lucide-react";
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
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Resume"
              subtitle="View my professional experience and qualifications"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
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

              {/* PDF Viewer placeholder */}
              <div className="relative aspect-[8.5/11] w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-card border border-border">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Resume Preview
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Upload your resume PDF to <code className="px-2 py-1 bg-secondary rounded text-sm">/public/resume.pdf</code> to enable the PDF viewer.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Or use the download button above to share your resume directly.
                  </p>
                </div>
                
                {/* Uncomment when PDF is available */}
                {<iframe
                  src={siteConfig.resumeUrl}
                  className="w-full h-full"
                  title="Resume PDF"
                />}
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Resume;
