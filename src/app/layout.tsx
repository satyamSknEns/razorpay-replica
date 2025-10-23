import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import LayoutWrapper from './components/LayoutWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-900 text-white" suppressHydrationWarning>
          <CookiesProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </CookiesProvider>
      </body>
    </html>
  );
}
