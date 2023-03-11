import { multipager } from "@/components/multipager";
import { variations } from "@/sketches/posters";

// @refresh reset

export const {
    getServerSideProps, SketchComponent,
} = multipager({
    title: 'Posters',
    description: 'Posters experiments',
    variations,
});
export default SketchComponent;