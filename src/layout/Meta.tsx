import Head from "next/head";

interface ShopHelmetProps {
  shopName?: string;
  slug: string;
  logoUrl: string;
  twitterHandle?: string;
}

const Meta = ({
  shopName,
  slug,
  logoUrl,
  twitterHandle = "@YourTwitterHandle",
   
}: ShopHelmetProps) => {
  const fullLogoUrl = logoUrl?.startsWith("http") ? logoUrl : `${logoUrl}`;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://pointhang.com";
  const fullUrl = `${baseUrl}/${slug}`;


  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={shopName}/>
      <meta name="keywords" content={shopName}/>
      {/* <link rel="canonical" href={fullUrl} /> */}
      <title>{shopName}</title>
      <link rel="icon" href={fullLogoUrl} type="image/png" />
      
      {/* Apple Touch Icons */}
      {[57, 60, 72, 76, 114, 120, 144, 152, 180].map((size) => (
        <link
          key={size}
          rel="apple-touch-icon"
          sizes={`${size}x${size}`}
          href={`${fullLogoUrl}`}
        />
      ))}
      
      {/* Favicon Icons */}
      {["192x192", "32x32", "96x96", "16x16"].map((size) => (
        <link
          key={size}
          rel="icon"
          type="image/png"
          sizes={size}
          href={fullLogoUrl}
        />
      ))}
      
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content={fullLogoUrl} />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Open Graph */}
      <meta property="og:title" content={shopName} />
      <meta property="og:description" content={shopName} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={fullLogoUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={shopName} />
      <meta property="fb:app_id" content="745303362249043" />
      <meta property="fb:pages" content="1056231387765931" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={shopName} />
      <meta name="twitter:description" content={shopName}/>
      <meta name="twitter:image" content={fullLogoUrl} />
      
      {/* Mobile Web App */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content={shopName} />
    </Head>
  );
};

export default Meta;