import "./globals.css";

import { Providers } from './providers'
import { RootLayout } from "./layout/RootLayout"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <RootLayout>
            {children}
          </RootLayout>
        </Providers>
      </body>
    </html>
  );
}
