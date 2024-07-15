import Head from "next/head";
import {TypeAnimation} from "react-type-animation";
import styles from "@/styles/Home.module.css";
import {AwesomeButton} from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';
import {useRouter} from "next/router";

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

export default function Home() {
    const router = useRouter();

    const handleLogin = async () => {
        await router.push("/login/");
    };

    const handleSignIn = async () => {
        await router.push("/register/");
    };

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.container}>
                    <Head>
                        <title>Welcome to MindMap</title>
                        <link rel="preconnect" href="https://fonts.googleapis.com"/>
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                        <link
                            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"/>
                    </Head>
                    <div className={styles.typeAnimationContainer}>
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
                                fontSize: '5em',
                                fontFamily: 'Playfair Display, serif',
                                whiteSpace: 'pre-line',
                                textAlign: 'center',
                            }}
                            repeat={Infinity}
                        />
                    </div>

                </div>

            </div>
            <div className={styles.buttonContainer}>
                <AwesomeButton
                    onPress={handleLogin}//kısa fonksiyonları buraya yazabilirsin
                    type="secondary"
                    style={{
                        buttonPrimaryColor: "#230a10",
                        height: "53px",
                        fontSize: "16px",
                        borderRadius: "10px",
                        primaryColor: "#00000"
                    }}
                >
                    Login
                </AwesomeButton>
                <AwesomeButton
                    onPress={handleSignIn}
                    type="secondary" style={{
                    buttonPrimaryColor: "#230a10",
                    height: "53px",
                    fontSize: "16px",
                    borderRadius: "10px",
                    primaryColor: "#00000"
                }}>Sign Up</AwesomeButton></div>

        </>
    );
}
