<template>
  <div class="support">
    <ee-titlebar
      :class="{ '--submitted': isSubmitted}"
      :text="pageTitle"
      :ease-in="350"
      :ease-out="350"
    />
    <transition name="fade" mode="out-in">
      <div v-if="!isFormActive">
        <div class="ee__page-content">
          <ee-text type="block">
            Our team is committed to bringing you top-grade content for <b>no cost at all</b>.
            Furthermore, you - the customer - are granted the freedom to help us steer
            this platform. If there’s <em>anything</em> you’d like to see our community
            accomplish, consider giving back to the providers.
          </ee-text>
          <ee-text type="block">
            Donations can contribute to a <b>variety of matters</b> including but not limited to:
            upgraded video-producing equipment; community out-reach programs (e.g. spiritual
            counseling, academic collaboration, providing for the underprivileged etc.);
            entrepreneurship; seminars; research; documentaries; podcast production; etc...
          </ee-text>
          <ee-text type="block">
            Even if you’d simply like to help our contributors <b>make a living</b> through producing
            more content, <em>your support furthers that possibility</em>. If any single one of these
            communal benefits appeals to your vision, then consider becoming one of our beloved
            benefactors!
          </ee-text>
          <ee-text class="support__patreon">
            <span>Support our <b>ORG</b> on</span>
            <a href="https://www.patreon.com/user?u=10855808&fan_landing=true" target="_blank">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOwAAAAwCAMAAAAl8WZyAAAAkFBMVEUAAAD/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk12xFArAAAAL3RSTlMAOUf2mcjxKLiWIob62stIFI0tG2NWDoB2C+TqXTPPwkDesKujfHBqCAS8nR+ST7Ssu3cAAARFSURBVGje7ZnZmqIwEEaLRRhtEMR9xV1w4/3fblqTIQl/2ib2fN/MBedOqiF1shY0NTQ0NDQ0NDT8XTqWxLJDX9B/xmNSuFpIXkZ9+XIyJSCDm2NCpvfeeeN5s9ZlcCUNCbu1kpVeZV8ozPY26dg8o11ScAtE5NtVrnvpKa+mCTcvoN3rzZPi2zUBIQt9VLPaEeIGRYVzn4Alj6nd1UPXQMieq7HZnRR8uHtIFSZFhf2IR6BPy8Dt+dO5ENJ2oEnH4jHUOnwn6wjZXxg9mMjqHzFPSKXFA3s1K8/VyyIwtjMeCI1kkYGJbL4qdCxBluG/KbsilbW+pX2BKLLItY4sroNAytIZ6WVbtWV3ySfLwUptFa3aJGGPH9xYJD08fhyyiuzs+eD7rmBsUbbXL8lI4lh2/TGJR53htuCkIMtY15XtEWMrekmQiX71cgJY5EjaBRdWUo9BdkJaYhaVHryey0OBspu6smVoXuYkGBaCCE9qZe9HWbUbByA7Ji23gnGX/HlyM5BlnExlD+w+mxgizyCF48tIdgnr4KVs7pQbOK7ytV7WMZWN8Hgfse7seE/n6Zuyo4B1Vk3Zu5iaONwuyPIcfi574ltLiqeHuewWZE+koy2CuJBDkG2FbPWZyR5xaXZ5swf2WFNZVc0F2fOkxIcB6+hLiLh6xV2yeWMmG0JZ0flzJYGj0kQWh8p/VXPMYCuSn2LByPJ559eRvRGjh1XFobyyKY8Kc9kIqoqXRUXm4TTC/VPIrngarTqyl+knI2tX4FIJSxeXpW8mO33gj8syp57s1FC2S7Tnkdu3soHzSVBW2/giZonzNjGRLZwHUG7+eBqj7IjfMa5dG2NKN6E/DdiUryuLjAllw18l64oDbhBpuaWALH2w3Ie1ZbEcm7NpLpXm3tuybdLIHkmHW461TByUpy/KkvdcvW0T2c1ajtvsoi//sN+TnZ1IAYsKLFFD7Xv1BWWle+rLro66F57gtHgwkd6TzWUtMpDNHM24XwuGrZelsJ5sOniwiK5YoiJBVl92/vlYj1cPJrLkYh2cbZT9E2Wtb2UhVZhNwMLsnLVhs63xiteHLXq5Ec2jrGizZgWFnLWyqZks7cTLLMp+jEpy9UjlpItOnsfRhf3iYnrZ/k9k40JP30w2C8qJjLKBYAganPm8EMRaWYb7A9kT30e7f+CNTsxkaaF79fe/+W6chYUOi17IZsH7si3p4JG3gJWRrCgGvNzkU+o0RVVPdkVZOr6SdR04ucAjhBqjSFBWv9w36nrYG8iyokhl28fxUHt//kJ2B/8swK+KPRJceKOQc5sqrPinEsYEfRJtbaySXAIpnt4J2FSK6HvxtZFvR7ZtRwnpWEf2IxiTIGaX1tJkY0/wqcIyUv7Qft54l2+MbJWoT0i8uLRmnjNfbSfaJK1nM1Yl6chO6N8zJVNya/DRbveOUUwNDQ0NDQ0N/xu/AQr874JXA5P+AAAAAElFTkSuQmCC"
                alt=""
              >
            </a>
          </ee-text>
          <ee-text type="block">
            Donations of any amount are <b>highly appreciated</b> and you can trust our commitment
            to create the transformations you’re passionate about!
          </ee-text>
          <ee-text type="header">
            want to share your own content?
          </ee-text>
          <ee-text type="block" class="support__after-header">
            Think you’ve got something of significant value and want to produce your own content for the community?
            <b>Click the button below</b> and shoot us a message. We’re excited to see what you
            can bring to the table!
          </ee-text>
          <ee-button class="support__button"
                     theme="dangerous"
                     @click="activateForm(0)"
          >
            {{ typeText[0] }}
          </ee-button>
          <ee-text type="header">
            want to collaborate?
          </ee-text>
          <ee-text type="block" class="support__after-header">
            Have the urge to collaborate with a member of the team? <b>Click the button below</b> and give yourself
            the chance to make it happen!
          </ee-text>
          <ee-button class="support__button"
                     theme="dangerous"
                     @click="activateForm(1)"
          >
            {{ typeText[1] }}
          </ee-button>
          <ee-text type="header">
            is something incorrect?
          </ee-text>
          <ee-text type="block" class="support__after-header">
            Did you see something posted in an article or video that you felt <em>inaccurately</em> represented
            your organization or area of expertise? <b>Click the button below</b> and let us know what we
            need to correct.
          </ee-text>
          <ee-button class="support__button"
                     theme="dangerous"
                     @click="activateForm(2)"
          >
            {{ typeText[2] }}
          </ee-button>
        </div>
        <ee-footer />
      </div>
      <div v-else-if="!isSubmitted">
        <div class="support__content">
          <ee-qnaform
            :id="formID"
            :questions="questions"
            :type="formType"
            :name-label="'Name or Preferred Title'"
            :show-back="true"
            :minchars="70"
            @back="back"
            @submitted="submitted"
          />
        </div>
        <ee-footer />
      </div>
      <div v-else>
        <ee-text class="support__submitted" type="block">
          Thank you for your interest in our content! Our team will try to get
          back to you <strong>within 7 days</strong> for our response.
        </ee-text>
        <ee-footer />
      </div>
    </transition>
  </div>
</template>


<script lang='ts'>import eeFooterVue from "@/components/layout/ee-footer.vue";
import eeQnaformVue, { FormQuestion } from "@/components/layout/ee-qnaform.vue";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import eeButtonVue from "@/components/ui/ee-button.vue";
import eeTextVue from "@/components/ui/ee-text.vue";
import { computed, defineComponent, ref } from "@vue/runtime-core";



const _qType0: FormQuestion[] = [
  { text: 'What about our organization interests you?' },
  {
    text: 'In what specific ways do you envision yourself contributing to this community?',
    subtext: 'Feel free to explain any of your talents or skills and how you’d utilize them to the fullest!',
  },
];

const _qType1: FormQuestion[] = [
  { text: 'Which member(s) would you like to collaborate with and why?' },
  { text: 'What does your collaboration require of that/those member(s)?' },
];

const _qType2: FormQuestion[] = [
  { text: 'What group, institution, organization, or field of expertise are you speaking on behalf of?' },
  { text: 'What specific issue(s) would you like to address?' },
];

const _formTypes = [_qType0, _qType1, _qType2];

const _typeText = [
  'share content with us',
  'collaborate with us',
  'correct us',
];


export default defineComponent({
  components: {
    'ee-titlebar' : eeTitlebarVue,
    'ee-footer'   : eeFooterVue,
    'ee-text'     : eeTextVue,
    'ee-button'   : eeButtonVue,
    'ee-qnaform'  : eeQnaformVue,
  },
  setup() {
    const isFormActive = ref(false);
    const isSubmitted  = ref(false);
    const formID       = ref('');
    const pageTitle    = computed(() =>
      isFormActive.value
        ? isSubmitted.value
          ? 'Request Submitted'
          : _typeText[formType.value]
        : 'Support'
    );
    const questions    = ref<FormQuestion[]>([]);
    const formType     = ref(0);

    function activateForm(type: number) {
      questions.value    = _formTypes[type];
      formType.value     = type;
      formID.value       = `support${type}`;
      isFormActive.value = true;
      document.body.scrollTo(0, 0);
    }

    function back()      { isFormActive.value = false; }
    function submitted() { isSubmitted.value = true; }

    return {
      activateForm,
      submitted,
      back,
      pageTitle,
      isFormActive,
      questions,
      isSubmitted,
      formType,
      typeText: _typeText,
      formID,
    };
  }
});



</script>