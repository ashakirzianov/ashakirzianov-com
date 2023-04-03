import { multipager } from "@/components/multipager";
import {
    bwway, loveMeTwoTimes,
} from "@/sketches/posters";

// @refresh reset

export const variations = [
    loveMeTwoTimes(),
    bwway(),
];

const {
    getServerSideProps, SketchComponent,
} = multipager({
    titlePlaceholder: 'Poster',
    descriptionPlaceholder: 'Dynamic poster',
    variations,
});
export { getServerSideProps };
export default SketchComponent;