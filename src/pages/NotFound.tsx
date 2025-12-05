import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/content";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{`404 - Page Not Found | ${siteConfig.name}`}</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block text-8xl md:text-9xl font-bold gradient-text mb-4"
              >
                404
              </motion.span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Page Not Found
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="hero" size="lg">
                  <Link to="/">
                    <Home />
                    Go Home
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="lg" onClick={() => window.history.back()}>
                  <span className="cursor-pointer">
                    <ArrowLeft />
                    Go Back
                  </span>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default NotFound;
