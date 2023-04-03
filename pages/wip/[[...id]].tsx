import { multipager } from "@/components/multipager";
import { variations } from "@/sketches/wip";

// @refresh reset

const { getServerSideProps, SketchComponent } = multipager({
    title: 'Work in progress',
    description: 'Undeveloped ideas',
    variations,
});
export { getServerSideProps };
export default SketchComponent;