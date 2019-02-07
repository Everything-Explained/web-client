<template>
  <div>
    <article id="Welcome" class="home markdown md-welcome" v-html="renderAbout"></article>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Markdown from 'markdown-it';

export default class Welcome extends Vue {
  public about =
`
**Hello there!**

_Do you like long walks on the Beach?_...**Just Kidding!!**
**Noumenae** is a harbor for those who feel their flesh isn’t all there is, especially when that flesh is _tearing at your soul_. All of us are struggling with _something_, desiring a solace from worry and doubt. This restlessness that we feel from the depth of our being, this _nagging tug_…is the reason Noumenae was created.

Unfortunately this material world has very little answers when it comes to the human condition. You'd think by now that with **all** the self-help books, we'd have figured out what gives our lives _meaning and purpose_. Thankfully though, the answer is often inside our own selves, but...**most of us can't hear it**. If you're ready to possibly find _the real You_, then I think **Noumenae** might just be the community you've been searching for.

Just so there's no mincing of words here, **Yes**, we are about the **Spiritual** work; the revealing of our hidden nature which we so often ignore. There is **no** judgement or condemnation here, only simple people whom all are on this journey with you. Now before you think we've all got our _rose-colored_ glasses on, let me say that I myself have been disenchanted with life on many occations; I know what depression feels like, _but that's what **Love** is for_.

___There is no doctrine___, only ___YOU___.
You are the light you never knew you had; _all of us **Are**_.
If you are thoroughly enticed by now _...hehe..._ then go ahead and check out the invite tab on the left or [Click Here][invite]

For a more complete understanding of this site, check out the [Rules] and [FAQ] sections.

[Noumenon]:#/home/faq/about-the-creation
[Rules]:#/home/rules
[invite]:#/invites
[FAQ]:#/home/faq/how-to-use-the-faq
`

  get renderAbout() { return new Markdown().render(this.about); }
}
</script>

<style lang='sass' src='./welcome.sass'></style>
