import '../styles/globals.css'
import { Roboto } from '@next/font/google'

const font = Roboto({ subsets: ['latin'], weight: ['100','400', '900'] })

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
    )
}