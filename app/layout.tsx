import type { Metadata } from "next";
import "./globals.css";
import { LayoutProvider } from "./layout/context/layoutcontext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "./styles/layout/layout.scss";
import "./styles/demo/Demos.scss";
import "./public/theme/theme-light/purple/theme.css";

export const metadata: Metadata = {
  title: "Xerox Demo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          id="theme-link"
          href="./public/theme/theme-light/purple/theme.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <PrimeReactProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
