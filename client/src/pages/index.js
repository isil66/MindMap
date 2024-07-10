import Head from "next/head";
import {TypeAnimation} from "react-type-animation";
import styles from "@/styles/Home.module.css"; // If you have any additional styles

export default function Home() {
    return (
        <div>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"/>
            </Head>
            <TypeAnimation
                preRenderFirstString={true}
                sequence={[
                    500,
                    'Your Second Brain \n for editing',
                    1000,
                    'Your Second Brain \n for journaling',
                    1000,
                    'Your Second Brain \n for remembering',
                    1000,
                    'Be Unconventional',
                    1000,
                    'Be You',
                    1000,
                ]}
                speed={50}
                style={{
                    fontSize: '4em',
                    fontFamily: 'Playfair Display, serif',
                    whiteSpace: 'pre-line',
                    height: '195px',
                    display: 'block'
                }}
                repeat={Infinity}
            />
        </div>
    );
}
