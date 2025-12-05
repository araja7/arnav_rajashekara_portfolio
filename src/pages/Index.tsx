import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { siteConfig } from "@/lib/content";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{`${siteConfig.name} | ${siteConfig.title}`}</title>
        <meta name="description" content={siteConfig.tagline} />
      </Helmet>
      <Layout>
        <HeroSection />
      </Layout>
    </>
  );
};

export default Index;
