import '@/app/ui/global.css'
import {inter} from '@/app/ui/fonts'
import { Metadata } from 'next';

export const metadata:Metadata = {
  title:{
    default:'nextjs练习',
    template:"%s | Next练习"
  },
  description:"一个简单的nextjs练习",
  keywords:['nextjs','typescript','react'],
  openGraph:{
    images:'/logo.png'
  },
  metadataBase:new URL("https://www.abc.com")
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
