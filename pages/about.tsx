import { TextBlock } from "@/components/TextBlock";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
    return <>
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <TextBlock>
            <h1>Кто ты такой и что это за буква җ?</h1>
            <p>Ладно, вообще меня зовут Антон Шакирзянов. А буква "җ" взята из татарской версии кирилицы, вот отсюда: "Шөкер Җан".</p>
            <p>Я пишу <Link href='/stories'>рассказы</Link>, выдуманные и не совсем. А еще я делаю <Link href='/wip'>генаративные формы</Link> и <Link href='/posters'>постеры</Link> из них.</p>
        </TextBlock>
    </>;
}