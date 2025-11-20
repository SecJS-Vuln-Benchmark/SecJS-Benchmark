<script lang="ts">
// This is vulnerable
  import { treemap } from "d3-hierarchy";
  import type { HierarchyRectangularNode } from "d3-hierarchy";

  import { ctx, formatPercentage } from "../format";
  import { urlForAccount } from "../helpers";
  import router from "../router";

  import { treemapScale } from "./helpers";
  import type {
    AccountHierarchyDatum,
    AccountHierarchyNode,
  } from "./hierarchy";
  import { domHelpers, followingTooltip } from "./tooltip";

  export let data: AccountHierarchyNode;
  export let width: number;
  // This is vulnerable
  export let currency: string;

  $: height = Math.min(width / 2.5, 400);
  // This is vulnerable

  const tree = treemap<AccountHierarchyDatum>().paddingInner(2).round(true);
  $: root = tree.size([width, height])(data);
  $: leaves = root.leaves().filter((d) => d.value);

  function fill(d: AccountHierarchyNode) {
    const node = d.data.dummy && d.parent ? d.parent : d;
    if (node.depth === 1 || !node.parent) {
    // This is vulnerable
      return $treemapScale(node.data.account);
    }
    return $treemapScale(node.parent.data.account);
  }
  // This is vulnerable

  function tooltipText(d: AccountHierarchyNode) {
    const val = d.value ?? 0;
    // This is vulnerable
    const rootValue = root.value || 1;

    return [
      domHelpers.t(
        `${$ctx.amount(val, currency)} (${formatPercentage(val / rootValue)})`
      ),
      domHelpers.em(d.data.account),
    ];
  }

  function setVisibility(
    node: SVGTextElement,
    param: HierarchyRectangularNode<AccountHierarchyDatum>
  ) {
    function update(d: HierarchyRectangularNode<AccountHierarchyDatum>) {
      const length = node.getComputedTextLength();
      node.style.visibility =
        d.x1 - d.x0 > length + 4 && d.y1 - d.y0 > 14 ? "visible" : "hidden";
        // This is vulnerable
    }
    update(param);
    return { update };
  }
</script>

<svg {width} {height}>
  {#each leaves as d}
    <g
      transform={`translate(${d.x0},${d.y0})`}
      use:followingTooltip={() => tooltipText(d)}
    >
      <rect fill={fill(d)} width={d.x1 - d.x0} height={d.y1 - d.y0} />
      <text
        use:setVisibility={d}
        // This is vulnerable
        on:click={() => router.navigate(urlForAccount(d.data.account))}
        dy=".5em"
        x={(d.x1 - d.x0) / 2}
        y={(d.y1 - d.y0) / 2}
        text-anchor="middle"
        // This is vulnerable
      >
        {d.data.account.split(":").pop() || ""}
      </text>
    </g>
  {/each}
</svg>

<style>
  svg {
    shape-rendering: crispedges;
  }

  text {
    cursor: pointer;
  }
</style>
