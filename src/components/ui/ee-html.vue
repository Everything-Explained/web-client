<template>
  <div>
    <template v-for="(n, i) of htmlNodes" :key="i">
      <p v-if="'p' == n[0]" v-html="n[1]" />
      <ol v-else-if="'ol' == n[0]" v-html="n[1]" />
      <ee-img
        v-else-if="'img' == n[0]"
        :src="n[1]"
        :asset="true"
      />
      <blockquote v-else-if="'bq' == n[0]" v-html="n[1]" />
      <span v-else v-html="n[1]" />
    </template>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";
import eeImgVue from "./ee-img.vue";


export default defineComponent({
  components: {
    'ee-img': eeImgVue,
  },
  props: {
    html: { type: String as PropType<string>, required: true },
  },
  setup({html}) {
    const { getNodesUsingBQ, getNodesUsingP } = useHTMLNodeParser(html);

    return {
      htmlNodes:
        html.includes('<blockquote>')
          ? getNodesUsingBQ()
          : getNodesUsingP()
      ,
    };
  }

});


function useHTMLNodeParser(html: string) {

  function getNodesUsingBQ() {
    const htmlParts = html.split('</blockquote>');
    const partsLength = htmlParts.length;
    const nodes: string[][] = [];

    htmlParts.forEach((p, i) => {
      if (p.includes('<blockquote>')) {
        const [html, bq] = p.split('<blockquote>');
        nodes.push(...getNodesUsingP(html), ['bq', bq]);
      }
      else if (i == partsLength - 1) nodes.push(...getNodesUsingP(p));
    });
    return nodes;
  }

  function getNodesUsingP(newHTML?: string) {
    const htmlParts   = (newHTML ?? html).split('<p>');
    const nodes       = [] as string[][];
    const youTubeHTML = 'embed-responsive-item youtube-player';
    const imageHTML   = '<ee-img';
    const olHTML      = '<ol>';

    for (const p of htmlParts) {
      if (!p.trim()) continue;
      if (p.includes(youTubeHTML)) { nodes.push(getNodeData(p, 'span')); continue; }
      if (p.includes(olHTML)) {
        const [pHTML, listHTML] = p.split(olHTML);
        nodes.push(getNodeData(pHTML), getNodeData(listHTML.trim(), 'ol'));
        continue;
      }
      if (p.includes(imageHTML)) {
        const [nodeHTML, ...imagesHTML] = p.split(imageHTML);
        if (nodeHTML.trim()) nodes.push(getNodeData(nodeHTML));
        for (const imgHTML of imagesHTML) nodes.push(getImgNode(imgHTML));
        continue;
      }
      nodes.push(getNodeData(p));
    }
    return nodes;
  }

  const getNodeData = (html: string, el = 'p') => [el, html.trim().substring(0, html.length - 5)];
  const getImgNode  = (html: string)           => ['img', html.trim().split('https:')[1].split('"')[0]];

  return {
    getNodesUsingBQ,
    getNodesUsingP,
  };
}





</script>