import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { TheRing } from "@/components/prologue/TheRing";
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
        <section className="flex min-h-[88vh] items-center pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="relative mx-auto flex w-fit items-center justify-center">
                <TheRing className="absolute h-[clamp(9rem,26vw,15rem)] w-[clamp(9rem,26vw,15rem)] opacity-25" />
                <span className="gilded relative text-[clamp(5.5rem,16vw,9.5rem)] font-semibold leading-none tracking-[0.04em]">
                  404
                </span>
              </div>
              <div>
                <h1 className="gilded mt-10 text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold uppercase leading-[1] tracking-[0.06em]">
                  Page Not Found
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg font-light italic text-bone-dim md:text-xl">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild variant="hero" size="lg">
                    <Link to="/">
                      <Home />
                      Go Home
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" onClick={() => window.history.back()}>
                    <ArrowLeft />
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default NotFound;
