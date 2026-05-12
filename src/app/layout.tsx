



import "./globals.css";
import ProviderWrapper from "../redux/ProviderWrapper";
import SocketProvider from "../providers/SocketProvider";
 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ProviderWrapper>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ProviderWrapper>
      </body>
    </html>
  );
}