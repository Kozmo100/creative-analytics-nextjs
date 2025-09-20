import './globals.css'

export const metadata = {
  title: 'Creative Analytics Dashboard',
  description: 'Transform your ad data into insights',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
