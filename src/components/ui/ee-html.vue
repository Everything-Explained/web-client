<template>
  <div>
    <template v-for="(n, i) of htmlNodes" :key="i">
      <p v-if="'p' == n[0]" v-html="n[1]" />
      <ol
        v-else-if="'ol' == n[0]"
        :start="n[2] || 1"
        v-html="n[1]"
      />
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
  const youTubeHTML = 'embed-responsive-item youtube-player';
  const imageHTML   = '<ee-img';
  const olHTML      = '<ol';


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

    for (const p of htmlParts) {
      if (!p.trim()) continue;
      if (p.includes(youTubeHTML)) { nodes.push(getNodeData(p, 'span')); continue; }
      if (p.includes(olHTML))      { nodes.push(...filterListNode(p));   continue; }
      if (p.includes(imageHTML))   { nodes.push(...filterImageNodes(p)); continue; }
      nodes.push(getNodeData(p));
    }
    return nodes;
  }


  function filterListNode(partialHTML: string) {
    const [pHTML, listHTML] = partialHTML.split(olHTML);
    const attrib = listHTML.split('>', 1)[0].trim();
    const cleanList = attrib
      ? listHTML.trimStart().substring(attrib.length + 1).trim()
      : listHTML.trimStart().substring(1).trim()
    ;
    const listNodeData = getNodeData(cleanList, 'ol');
    if (attrib) listNodeData.push(attrib.split('"')[1]);
    return [getNodeData(pHTML), listNodeData];
  }


  function filterImageNodes(partialHTML: string) {
    const [nodeHTML, ...imagesHTML] = partialHTML.split(imageHTML);
    const imgNodeData = imagesHTML.map(getImgNodeData);
    return nodeHTML.trim() ? [getNodeData(nodeHTML), ...imgNodeData] : imgNodeData;
  }


  const getNodeData     = (html: string, el = 'p') => [el, html.trim().substring(0, html.length - 5)];
  const getImgNodeData  = (html: string)           => ['img', html.trim().split('https:')[1].split('"')[0]];


  return {
    getNodesUsingBQ,
    getNodesUsingP,
  };
}





</script>