import { multipager } from "@/components/multipager";
import { variations } from "@/sketches/knots";

// @refresh reset

export const { getStaticPaths, getStaticProps, SketchComponent } = multipager({
    title: 'Knots',
    description: 'Knots series',
    variations,
});
export default SketchComponent;