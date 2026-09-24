import LandingContent from "@/components/LandingContent";

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AetherFetch",
  alternateName: "Aether Fetch",
  url: "https://aetherfetch.vercel.app/",
};

export default function RootPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <LandingContent />
    </>
  );
}
