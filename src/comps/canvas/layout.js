import { DagreLayout } from "@antv/layout";
import { Graph } from "@antv/x6";

/**
 *
 * @param {Graph} grap
 * @param {"TB" | "BT" | "LR" | "RL"} rankdir
 * @returns
 */
export function formatLayout(graph, rankdir = "TB") {
  if (!graph) {
    return;
  }
  const layoutFunc = new DagreLayout({
    type: "dagre",
    rankdir,
    align: "UL",
    // ranksepFunc: (d) => {
    //   const edges = graph.getOutgoingEdges(d.id);
    //   let max = 0;
    //   if (edges && edges.length > 0) {
    //     edges.forEach((edge) => {
    //       const edgeView = graph.findViewByCell(edge);
    //       const labelView = edgeView?.findAttr(
    //         "width",
    //         _.get(edgeView, ["labelSelectors", "0", "body"], null)
    //       );
    //       const labelWidth = labelView ? +labelView : 0;
    //       max = Math.max(max, labelWidth);
    //     });
    //   }
    //   return 50 + max;
    // },
    nodesep: 50,
    controlPoints: true,
  });

  console.log("layoutFunc", rankdir);

  const json = graph.toJSON();
  const nodes = json.cells.filter((cell) => !cell.labels);

  const edges = json.cells.filter((cell) => !cell.size);
  const newModel = layoutFunc?.layout({
    nodes,
    edges,
  });
  graph.fromJSON(newModel);

  return rankdir;
}
