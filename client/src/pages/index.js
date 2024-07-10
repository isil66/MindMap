import Head from "next/head";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from "@/styles/Home.module.css";
import {TypeAnimation} from "react-type-animation";
import {useState} from "react";

const inter = Inter({subsets: ["latin"]});

export default function Home() {

    return (
        <div>
            <TypeAnimation
                preRenderFirstString={true}
                sequence={[
                    500,
                    'Your Second Brain for editing',
                    1000,
                    'Your Second Brain for journaling',
                    1000,
                    'Your Second Brain for remembering',
                    1000,
                    'Be unconventional',
                    1000,
                    'Be you',
                    500,
                ]}
                speed={50}
                style={{fontSize: '2em'}}
                repeat={Infinity}
            />

        </div>
    );
}
