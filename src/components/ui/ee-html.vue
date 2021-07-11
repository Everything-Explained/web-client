<template>
  <div>
    <template v-for="(n, i) of htmlNodes" :key="i">
      <p v-if="'p' == n[0]" v-html="n[1]" />
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
    const htmlParts  = (newHTML ?? html).split('<p>');
    const ytVideoStr = 'embed-responsive-item youtube-player';
    const imageStr   = '<ee-img';
    const nodes      = [] as string[][];

    for (const p of htmlParts) {
      if (!p.trim()) continue;
      if (p.includes(ytVideoStr)) { nodes.push(getNodeFromText(p, 'span')); continue; }
      if (p.includes(imageStr)) {
        const [nodeHTML, ...imagesHTML] = p.split(imageStr);
        if (nodeHTML.trim()) nodes.push(getNodeFromText(nodeHTML));
        for (const imgHTML of imagesHTML) nodes.push(getNodeFromSrc(imgHTML));
        continue;
      }
      nodes.push(getNodeFromText(p));
    }
    return nodes;
  }

  const getNodeFromText = (node: string, el = 'p') => [el, node.trim().substring(0, node.length - 5)];
  const getNodeFromSrc  = (node: string)           => ['img', node.trim().split('https:')[1].split('"')[0]];

  return {
    getNodesUsingBQ,
    getNodesUsingP,
  };
}





</script>