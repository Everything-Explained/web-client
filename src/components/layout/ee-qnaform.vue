<template>
  <div class="qnaf">
    <div class="qnaf__form">
      <ee-input v-model="name"
                class="qnaf__input"
                :minchars="3"
                :maxchars="20"
                :validate="validateInput"
                :tally="true"
      >
        {{ nameLabel }}
      </ee-input>
      <br>

      <ee-input v-model="email"
                class="qnaf__input"
                type="email"
                :validate="validateInput"
      >
        E-Mail
      </ee-input>
      <br>
      <div v-for="(q, i) of questionObjs"
           :key="i"
           class="qnaf__question-block"
      >
        <div class="qnaf__question-container">
          <span :data-num="i + 1 + '⁍'" class="qnaf__question">{{ q.text }}</span>
          <br>
          <div v-if="q.subtext" class="qnaf__subtext">
            {{ q.subtext }}
          </div>
        </div>
        <ee-input v-model="q.answer"
                  type="area"
                  class="qnaf__area-input"
                  :minchars="minchars"
                  :maxchars="maxchars"
                  :placeholder="'Answer here...'"
                  :validate="validateInput"
        />
      </div>
      <div class="qnaf__controls">
        <ee-button v-if="showBack"
                   class="qnaf__back-button"
                   type="neutral"
                   @click="$emit('back')"
        >
          BACK
        </ee-button>
        <ee-button :theme="'attention'" :disabled="!areInputsValidated">
          SUBMIT
        </ee-button>
        <transition name="fade">
          <ee-text v-if="remainingInputs > 0" class="qnaf__validation-text">
            <strong>{{ remainingInputs }}</strong> field(s) require(s) attention
          </ee-text>
        </transition>
      </div>
    </div>
  </div>
</template>


<script lang='ts'>
import useInputValidation from "@/composeables/inputValidation";
import { defineComponent, PropType, reactive, toRefs } from "@vue/runtime-core";
import eeButtonVue from "../ui/ee-button.vue";
import eeInputVue from "../ui/ee-input.vue";
import eeTextVue from "../ui/ee-text.vue";


export type FormQuestion = { text: string; subtext?: string; answer: string; }


export default defineComponent({
  components: {
    'ee-text': eeTextVue,
    'ee-input': eeInputVue,
    'ee-button': eeButtonVue,
  },
  props: {
    questions : { type: Array   as PropType<FormQuestion[]>, default: []          },
    nameLabel : { type: String  as PropType<string>,         default: 'Your Name' },
    showBack  : { type: Boolean as PropType<boolean>,        default: false       },
    uri       : { type: String  as PropType<string>,         default: ''          },
    minchars  : { type: Number  as PropType<number>,         default: 100         },
    maxchars  : { type: Number  as PropType<number>,         default: 500         },
  },
  emits: ['back', 'submitted'],
  setup(props, ctx) {
    const { questions, uri } = props;
    const questionObjs  = props.questions.map(reactive);

    const inputValidation = useInputValidation(2 + props.questions.length);

    const formData = reactive({
      name: '',
      email: '',
    });

    if (!questions.length) throw Error('qnaform::Missing Questions');

    return {
      ...toRefs(formData),
      validateInput: inputValidation.validate,
      remainingInputs: inputValidation.remaining,
      areInputsValidated: inputValidation.isValidated,
      questionObjs,
    };
  }
});

</script>