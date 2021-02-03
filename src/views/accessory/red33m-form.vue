<template>
  <div class="r3d-form__container">
    <title-bar>RED33M Access Form</title-bar>
    <ee-text type='block'>
      This form functions as an application for access to exclusive content.
      It is <em>by no means</em> a test for a single specific type of personality, intelligence,
      or level of advancement in spirituality. <br><br>
      <strong>Our team keeps this content exclusive for various significant reasons:</strong>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      It can be especially toxic for those pursuing Enlightenment.
      </li></ul>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      It can be exceedingly difficult to understand even for those who have undergone
      high-level Awakenings. It’s <strong>guaranteed</strong> to be misunderstood and mis-contextualized
      by anyone who doesn’t at least have a conceptual understanding of Enlightenment.
      Understanding Enlightenment is a pre-requisite.
      </li></ul>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      The content is <em>overtly illogical & contradictory</em>. Distributing logically-dissonant information
      like this puts the distributor in an unbalanced and potentially dangerous position
      of power that must be accounted for responsibly.
      </li></ul>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      The topics discussed are <strong>unverifiable</strong> even through spiritual methods, let alone scientific
      evidence. This makes the distributor similar to an unquestionable religious authority and they
      <em>absolutely will not</em> supplant themselves in such a position publicly.
      </li></ul>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      Before going unlisted, this content had about 30 initial subscribers and two of them openly contemplated
      suicide. <strong>1 in 15 is too irresponsible a risk</strong>.
      </li></ul>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      This content can solicit <em>deep existential crises</em> but those weren’t the reasons for suicidal
      thoughts; it provides very compelling information about the hereafter, which can make some people desire
      to go there as soon as possible, while seeing very little reason to stay.
      </li></ul>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      You may have a more difficult time finding purpose in life after viewing this material. For some,
      the content has left them feeling adrift while for others, it’s been credited as having
      “saved their lives.” This content is very extreme in that manner. It either greatly helps or hurts.
      </li></ul>
    </ee-text>
    <ee-text type='block' class="r3d-form__list-item">
      <ul><li>
      We feel that we should only choose to distribute this content to those who will find priceless value
      in it so as to not bring anyone harm.
      </li></ul>
    </ee-text>
    <ee-text type='block'>
      By clicking the <strong>ENTER</strong> button below, you're agreeing to take full responsibility for
      all your (re)actions based on the exclusive content, <em>including but not limited to</em>,
      <strong>all risks mentioned above</strong>. You also agree that <strong>everything-explained.org</strong>
      and all associated persons are <em>not</em> responsible in any way for your (re)actions based on
      the exclusive content.
    </ee-text>
    <ee-button class="r3d-form__button-accept" theme='attention'>ACCEPT AND ENTER</ee-button>
<!--
          Please respond to the questions in an honest manner.<br><br>

      <em>Do not</em> enter responses that are intended to make you seem more advanced or Enlightened. This
      isn’t necessarily a test and even if you’re very Enlightened, it doesn’t mean that this content
      is going to be beneficial to you. -->
    <!-- <flow-form @formComplete="complete" :fields="fields"></flow-form> -->
  </div>
</template>




<script lang='ts'>
import titlebarVue from "@/components/layout/titlebar.vue";
import eeButton from "@/components/ui/ee-button.vue";
import eeTextVue from "@/components/ui/ee-text.vue";
// import flowFormVue, { FormField } from "@/components/ui/flow-form.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    // 'flow-form': flowFormVue,
    'title-bar': titlebarVue,
    'ee-text': eeTextVue,
    'ee-button': eeButton,
  },
  setup() {
    // const fields: FormField[] = [
    //   { text: 'hello', type: 'text' }
    // ]

    return {
      complete: (data: unknown) => console.log(data),
      // fields,
    }
  }
})

</script>