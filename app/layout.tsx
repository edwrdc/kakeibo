import "./globals.css";
import { Inter } from "next/font/google";
import { Providers as ReduxProviders } from "@/app/redux/provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import GenericConfirmDialog from "@/components/GenericConfirmDialog";
import GenericModal from "@/components/GenericModal";
import Navigation from "./components/Navigation";
import { getCurrentUserAction } from "@/actions";
import NavigationTabs from "@/components/NavigationTabs";
import { Metadata, Viewport } from "next";

const InterFont = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const APP_NAME = "Kakeibo";
const APP_DEFAULT_TITLE = "Kakeibo | Personal Finance";
const APP_TITLE_TEMPLATE = "%s -Kakeibo";
const APP_DESCRIPTION =
  "Self Hosted personal finance app. Track your spending, set a budget, and save more.";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#9DBC98",
};

interface ILayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: ILayoutProps) {
  const { user } = await getCurrentUserAction();

  return (
    <html lang="en">
      <body className={InterFont.className}>
        <ReduxProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {user ? <Navigation /> : null}
            <NavigationTabs />
            {children}
            <GenericModal />
            <GenericConfirmDialog />
          </ThemeProvider>
          <Toaster />
        </ReduxProviders>
      </body>
    </html>
  );
}
