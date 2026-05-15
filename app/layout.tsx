import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import MetaPixelClient from "./components/MetaPixelClient";

const appUrlRaw =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
const appUrl = appUrlRaw.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "PREMIUM - Collection Exclusive de Vestes Haut de Gamme",
  description:
    "Découvrez notre collection exclusive de vestes premium, alliant style, confort et qualité exceptionnelle. Design ultra moderne avec animations 3D interactives.",
  keywords: [
    "vestes premium",
    "mode haut de gamme",
    "collection exclusive",
    "vestes luxe",
    "fashion premium",
  ],
  authors: [{ name: "PREMIUM" }],
  creator: "PREMIUM",
  publisher: "PREMIUM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "PREMIUM - Collection Exclusive de Vestes Haut de Gamme",
    description:
      "Découvrez notre collection exclusive de vestes premium, alliant style, confort et qualité exceptionnelle.",
    url: appUrl,
    siteName: "PREMIUM",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PREMIUM - Collection Exclusive",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PREMIUM - Collection Exclusive de Vestes Haut de Gamme",
    description:
      "Découvrez notre collection exclusive de vestes premium, alliant style, confort et qualité exceptionnelle.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Preconnect pour les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Fonts - Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifest pour PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color pour mobile */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />

        {/* Viewport optimisé */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />

        {/* Security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {/* Disable automatic phone number detection */}
        <meta name="format-detection" content="telephone=no" />

        {/* Disable automatic date detection */}
        <meta name="format-detection" content="date=no" />

        {/* Disable automatic address detection */}
        <meta name="format-detection" content="address=no" />

        {/* Disable automatic email detection */}
        <meta name="format-detection" content="email=no" />


        </head>
        <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
          <MetaPixelClient />
          {/* Skip to main content pour l'accessibilité */}
         <a
           href="#main-content"
           className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-semibold"
         >
           Aller au contenu principal
         </a>

         {/* Contenu principal avec CartProvider */}
         <CartProvider>
           <main id="main-content">{children}</main>
         </CartProvider>

         {/* Scripts de performance (chargés de manière asynchrone) */}
         <script
           dangerouslySetInnerHTML={{
             __html: `
               // Optimisation des performances
               if ('loading' in HTMLImageElement.prototype) {
                 const images = document.querySelectorAll('img[loading="lazy"]');
                 images.forEach(img => {
                   img.src = img.dataset.src;
                 });
               }
               
               // Préchargement des ressources critiques
               const preloadLinks = [
                 { rel: 'preload', href: '/products/rouge.webp', as: 'image' },
                 { rel: 'preload', href: '/products/blue.webp', as: 'image' },
               ];
               
               preloadLinks.forEach(link => {
                 const linkEl = document.createElement('link');
                 Object.assign(linkEl, link);
                 document.head.appendChild(linkEl);
               });
             `,
           }}
         />
       </body>
     </html>
   );
}