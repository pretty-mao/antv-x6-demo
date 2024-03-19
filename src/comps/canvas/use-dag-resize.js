import { debounce } from "lodash";
import { useResizeObserver } from "@vueuse/core"; 

/**
 * 
 * @param {import('vue').Ref<HTMLElement>} container 
 * @param {import('vue').Ref<import('@antv/x6').Graph>} graph 
 */
export function useDagResize(container, graph) {
  console.log('useDagResize');
  const resize = debounce(() => {
    if (container.value) {
      const w = container.value.offsetWidth;
      const h = container.value.offsetHeight;
      graph.value?.resize(w, h);
    }
  }, 200);

  useResizeObserver(container, resize);
}
