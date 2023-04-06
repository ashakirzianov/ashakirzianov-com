import { TextBlock } from "@/components/TextBlock";
import Head from "next/head";

export default function AboutPage() {
    return <>
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <TextBlock>
            <h1>Кто ты такой и что это за буква җ?</h1>
            <p>Ладно, вообще меня зовут Антон Шакирзянов, но я взял себе псевдоним Анҗан. Шөкер Җан на татарском означает "благодарная душа", буква "җ" от туда.</p>
            <p>Я пишу рассказы, выдуманные и не совсем. А еще я делаю генаративные формы и постеры из них.</p>
        </TextBlock>
    </>;
}