import './globals.css';

export const metadata = {
  title: 'Creativity Walks - Guided Thinking',
  description: 'Enhance your creative thinking with guided walking experiences and personalized thought prompts for your walk',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Space+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black antialiased">
        {children}
      </body>
    </html>
  )
}