import { multipager } from "@/components/multipager";
import { wip } from "@/sketches/wip";

// @refresh reset

const { getServerSideProps, SketchComponent } = multipager({
    title: 'Work in progress',
    description: 'Undeveloped ideas',
    variations: wip,
});
export { getServerSideProps };
export default SketchComponent;