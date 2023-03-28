import { multipager } from "@/components/multipager";
import {
    bwway, loveMeTwoTimes,
} from "@/sketches/posters";

// @refresh reset

export const variations = [
    bwway(),
    loveMeTwoTimes(),
];

export const {
    getServerSideProps, SketchComponent,
} = multipager({
    title: 'Posters',
    description: 'Poster experiments',
    variations,
});
export default SketchComponent;