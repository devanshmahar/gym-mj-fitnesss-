import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'MJ FITNESS | Transform Your Body, Transform Your Life — Dehradun',
  description:
    'Dehradun\'s premier fitness destination. Expert trainers, flexible membership plans, and cutting-edge equipment. Join MJ FITNESS today!',
  keywords: 'gym, fitness, Dehradun, MJ Fitness, workout, membership, personal training, bodybuilding, Uttarakhand',
  openGraph: {
    title: 'MJ FITNESS — Dehradun',
    description: 'Transform Your Body, Transform Your Life',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="bg-[#0a0a0a] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
