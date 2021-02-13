<template>
  <div class="r3d-form__container">
    <title-bar>RED33M Access Form</title-bar>
    <transition name="fade" mode="out-in">
      <div v-if="!hasAccepted">
        <ee-text type="block">
          This form functions as an application for access to exclusive content.
          It is <em>by no means</em> a test for a single specific type of personality, intelligence,
          or level of advancement in spirituality. <br><br>
          <strong>Our team keeps this content exclusive for various significant reasons:</strong>
        </ee-text>
        <ee-text v-for="(risk, i) of risks"
                 :key="i"
                 class="r3d-form__list-item"
                 type="block"
        >
          <ul><li v-html="risk" /></ul>
        </ee-text>
        <ee-text type="block">
          By clicking the <strong>ENTER</strong> button below, you're agreeing to take full responsibility for
          all your (re)actions based on the exclusive content, <em>including but not limited to</em>,
          <strong>all risks mentioned above</strong>. You also agree that <strong>everything-explained.org</strong>
          and all associated persons are <em>not</em> responsible in any way for your (re)actions based on
          the exclusive content.
        </ee-text>
        <ee-button class="r3d-form__button"
                   theme="attention"
                   @click="accept"
        >
          ACCEPT AND BEGIN
        </ee-button>
      </div>

      <div v-else-if="!hasCompleted" class="r3d-form__form">
        <div class="r3d-form__disclaimer">
          <ee-text type="block">
            <strong>Please respond to the following questions in an honest manner.</strong> This form will
            determine if you’re more or less likely to <strong>gain value</strong> from the exclusive content.
            <br><br>
            <em>Do not</em> enter responses that are intended to make you seem more advanced or Enlightened.
            This isn’t necessarily a test and even if you’re very Enlightened, it <strong>doesn’t</strong>
            mean that this content is going to be beneficial to you.
            <br><br>
            This application is meant to gauge you on the following:
          </ee-text>
          <ee-text v-for="(aptitude, i) of aptitudes"
                   :key="i"
                   class="r3d-form__list-item"
                   type="block"
          >
            <ul><li v-html="aptitude" /></ul>
          </ee-text>
          <ee-text class="r3d-form__begin-text" type="block">
            <em>
              If you feel like you're ready to undergo this process, begin filling out
              the sections below:
            </em>
          </ee-text>
        </div>
        <br><br>
        <div v-for="(q, i) of questions"
             :key="i"
             class="r3d-form__input-block"
        >
          <ee-text class="r3d-form__question"
                   type="text"
                   :data-num="i + 1 + '⁍'"
          >
            <span v-html="q.text" />
          </ee-text>
          <ee-input v-model="q.answer.value"
                    class="r3d-form__area"
                    type="area"
                    :minchars="minAreaChars"
                    :maxchars="maxAreaChars"
                    :showchars="true"
                    placeholder="Enter your answer here..."
          />
        </div>
        <ee-button class="r3d-form__button"
                   :theme="'attention'"
                   type="submit"
                   :disabled="!!fieldsToFill"
                   @click="complete"
        >
          CONTINUE
        </ee-button>
        <transition name="fade">
          <ee-text v-if="fieldsToFill" class="r3d-form__field-counter">
            <strong>{{ fieldsToFill }}</strong> more field(s) require(s) attention.
          </ee-text>
        </transition>
      </div>

      <div v-else-if="!hasSubmitted">
        <ee-text class="r3d-form__text-block" type="block">
          <strong>Last but not least</strong>, please fill out your contact information below so we can
          get in touch with you once we've reviewed your responses.
        </ee-text>
        <br>
        <div class="r3d-form__input-container">
          <ee-input v-model="name"
                    class="r3d-form__text-input"
                    name="name"
                    type="text"
                    :minchars="minFieldChars"
                    :maxchars="maxFieldChars"
          >
            First Name or Alias
          </ee-input><br>
          <ee-input v-model="email"
                    class="r3d-form__text-input"
                    name="email"
                    type="text"
          >
            E-mail
          </ee-input><br>
          <ee-button class="r3d-form__button submit"
                     theme="attention"
                     type="submit"
          >
            SUBMIT
          </ee-button>
        </div>
      </div>

      <div v-else-if="hasSubmitted">
        <ee-text class="r3d-form__submission-text" type="block">
          <h1>request submitted</h1>
          <strong>Thank you for your interest in this exclusive content.</strong> Our team will get back to
          you as soon as possible. Whatever the results may be, <em>do not take them personally</em>.<br><br>

          Ethan is friends with some of the most Enlightened people on the planet and has shared this exclusive
          content with some of them; <strong>even they</strong> have not all found it beneficial. Negative
          results should not be taken as a negative reflection on you. <br><br>

          Expect a response <strong>within 7 days</strong>, whether that response is to <strong>grant</strong> or
          <em>reject</em> access to this content.
        </ee-text>
      </div>
    </transition>
  </div>
</template>


<script lang='ts'>
import { computed, defineComponent, ref, Ref } from "vue";
import titlebarVue  from "@/components/layout/titlebar.vue";
import eeButton     from "@/components/ui/ee-button.vue";
import eeInput      from "@/components/ui/ee-input.vue";
import eeTextVue    from "@/components/ui/ee-text.vue";


const _risks = [
' It can be especially toxic for those pursuing Enlightenment.'
,

` It can be exceedingly difficult to understand even for those who have undergone
high-level Awakenings. It’s <strong>guaranteed</strong> to be misunderstood and mis-contextualized
by anyone who doesn’t at least have a conceptual understanding of Enlightenment.
Understanding Enlightenment is a pre-requisite.
`,

` The content is <em>overtly illogical & contradictory</em>. Distributing logically-dissonant information
like this puts the distributor in an unbalanced and potentially dangerous position
of power that must be accounted for responsibly.
`,

` The topics discussed are <strong>unverifiable</strong> even through spiritual methods, let alone scientific
evidence. This makes the distributor similar to an unquestionable religious authority and they
<em>absolutely will not</em> supplant themselves in such a position publicly.
`,

` Before going unlisted, this content had about 30 initial subscribers and two of them openly contemplated
suicide. <strong>1 in 15 is too irresponsible a risk</strong>.
`,

` This content can solicit <em>deep existential crises</em> but those weren’t the reasons for suicidal
thoughts; it provides very compelling information about the hereafter, which can make some people desire
to go there as soon as possible, while seeing very little reason to stay.
`,

` You may have a more difficult time finding purpose in life after viewing this material. For some,
the content has left them feeling adrift while for others, it’s been credited as having
“saved their lives.” This content is very extreme in that manner; it either greatly helps or hurts.
`,

` We feel that we should only choose to distribute this content to those who will find priceless value
in it so as to not bring anyone harm.
`,

];


const _questions = [
  'What is your definition of Enlightenment (what does it mean to be Enlightened)?',

  'Do you find the pursuit of Enlightenment to be spiritually beneficial? If so, what \
   benefits can Enlightenment provide to spiritual practitioners and those in their life?',

  'Do you think there are any <strong>cons</strong> to Enlightenment or is it all \
   <strong>pros</strong>?',

  'Do you think the ego should be regarded as real or illusory? Should it be cultivated \
   or unrealized?',

  'Do you think that egoic desires can be good or are they problematic by nature? Does \
   the ego provide any beneficial functions or is it inherently-destructive?'
];


const _aptitudes = [
  ' Your understanding of Enlightenment (not necessarily about how Enlightened you are).',
  ' Your flexibility in entertaining different concepts and your reasons for entertaining them.',
  ' Your mental fortitude',
  ' Your religious inclinations',
  ' Your spiritual inclinations and your application of them in life.'
];

export default defineComponent({
  components: {
    'title-bar' : titlebarVue,
    'ee-text'   : eeTextVue,
    'ee-button' : eeButton,
    'ee-input'  : eeInput,
  },
  setup() {
    const hasAccepted = ref(false);
    const hasCompleted = ref(false);
    const hasSubmitted = ref(false);
    const name = ref('');
    const email = ref('');
    const minFieldChars = 4; const maxFieldChars = 30;
    const minAreaChars = 120; const maxAreaChars = 500;

    const questions = _questions.map(
      q => ({ text: q, answer: ref('')})
    );

    const fieldsToFill = computed(() => {
      let fields = 0;
      fields += questions.reduce((pv, cv) => {
        return cv.answer.value.length < minAreaChars ? pv + 1 : pv;
      }, 0);
      return fields;
    });

    function forwardState(refVar: Ref<boolean>) {
      refVar.value = true;
      document.body.scrollTo(0, 0);
    }

    const accept = () => forwardState(hasAccepted);
    const complete = () => forwardState(hasCompleted);
    const submit = () => {
      forwardState(hasSubmitted);
    };

    return {
      hasAccepted, hasCompleted, hasSubmitted,
      accept, complete, submit,
      name, email,
      questions, fieldsToFill,
      minFieldChars, maxFieldChars, maxAreaChars, minAreaChars,
      risks: _risks, aptitudes: _aptitudes,
    };
  }
});

</script>


