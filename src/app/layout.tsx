import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Fitness Tracker",
    description: "The all in one fitness tracker.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="antialiased">
            <head>
                <link
                    href="./globals.css"
                    rel="stylesheet"
                />
                
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
