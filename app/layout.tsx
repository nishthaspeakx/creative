import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'SpeakX Creative Studio',description:'Your creative repository, competitor intelligence and marketing reports.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
