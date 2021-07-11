<template>
  <div>
    <template v-for="(n, i) of htmlNodes" :key="i">
      <p v-if="isP(n[0])" v-html="n[1]" />
      <ee-img
        v-else-if="isImg(n[0])"
        :src="n[1]"
        :asset="true"
      />
      <blockquote v-else-if="isBlockquote(n[0])" v-html="n[1]" />
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

    const htmlNodes =
      html.includes('<blockquote>')
        ? getNodesUsingBQ()
        : getNodesUsingP()
    ;

    return {
      isP: (node: string) => node == 'p',
      isImg: (node: string) => node == 'img',
      isBlockquote: (node: string) => node == 'bq',
      htmlNodes
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
        const parsedNodes = getNodesUsingP(html);
        const bqNode = ['bq', bq];
        nodes.push(...[...parsedNodes, bqNode]);
      }
      else if (i == partsLength - 1) {
        const parsedNodes = getNodesUsingP(p);
        nodes.push(...parsedNodes);
      }
    });
    return nodes;
  }

  function getNodesUsingP(newHTML?: string) {
    const htmlParts = (newHTML ?? html).split('<p>');
    const nodes = [] as string[][];
    for (const p of htmlParts) {
      if (!p.trim()) continue;
      if (p.includes('embed-responsive-item youtube-player')) {
        nodes.push(getTextFromNode(p, 'span'));
        continue;
      }
      if (p.includes('ee-img')) {
        const [text, ...images] = p.split('<ee-img');
        if (text.trim()) nodes.push(getTextFromNode(text));
        for (const img of images) nodes.push(getSrcFromNode(img));
        continue;
      }
      nodes.push(['p', p.trim().substring(0, p.length - 5)]);
    }
    return nodes;
  }

  const getTextFromNode = (node: string, el = 'p') => [el, node.trim().substring(0, node.length - 5)];
  const getSrcFromNode  = (node: string) => ['img', node.trim().split('https:')[1].split('"')[0]];

  return {
    getNodesUsingBQ,
    getNodesUsingP,
  };
}





</script>