// eslint-disable-next-line prettier/prettier
import { Navbar } from '@/components/navigation/Navbar'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Navbar>{children}</Navbar>
}
