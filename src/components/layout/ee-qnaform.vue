<template>
  <div class="qnaf ee__page-content">
    <div class="qnaf__form">
      <ee-input
        v-model="name"
        class="qnaf__input"
        :minchars="3"
        :maxchars="20"
        :validate="validateInput"
        :regex="nameRegex"
        :tally="true"
        :errmsg="'<em>Special characters</em> are not allowed'"
      >
        {{ nameLabel }}
      </ee-input>
      <br>

      <ee-input
        v-model="email"
        class="qnaf__input"
        type="email"
        :validate="validateInput"
      >
        E-Mail
      </ee-input>
      <br>

      <div
        v-for="(q, i) of questionRefs"
        :key="i"
        class="qnaf__question-block"
      >
        <div class="qnaf__question-container">
          <span
            :data-num="i + 1 + '⁍'"
            class="qnaf__question md"
            v-html="q.text"
          />
          <br>
          <div v-if="q.subtext" class="qnaf__subtext">
            {{ q.subtext }}
          </div>
        </div>
        <ee-input
          v-model="q.answer"
          type="area"
          class="qnaf__area-input"
          :minchars="minchars"
          :maxchars="maxchars"
          :placeholder="'Answer here...'"
          :validate="validateInput"
        />
      </div>
      <div class="qnaf__controls">
        <ee-button
          v-if="showBack"
          class="qnaf__back-button"
          type="neutral"
          @click="$emit('back')"
        >
          BACK
        </ee-button>
        <ee-button
          :theme="'attention'"
          :disabled="!areInputsValidated"
          :loading="isSubmitting"
          @click="submit"
        >
          SUBMIT
        </ee-button>
        <ee-text v-if="remainingInputs > 0" class="qnaf__validation-text">
          <strong>{{ remainingInputs }}</strong> field(s) require(s) attention
        </ee-text>
        <ee-form-error
          v-else
          class="qnaf__error-text"
          :update="errorUpdate"
          :text="errorText"
        />
      </div>
    </div>
  </div>
</template>


<script lang='ts'>
import { defineComponent, PropType, reactive, toRefs } from "@vue/runtime-core";
import useInputValidation from "@/composeables/inputValidation";
import { APIErrorResp, useAPI }         from "@/services/api_internal";
import eeButtonVue        from "../ui/ee-button.vue";
import eeFormErrorVue     from "../ui/ee-form-error.vue";
import eeInputVue         from "../ui/ee-input.vue";
import eeTextVue          from "../ui/ee-text.vue";
import { VuexStore } from "@/vuex/vuex-store";
import { useStore } from "vuex";


export type FormQuestion = { text: string; subtext?: string; answer?: string; }

interface ReactiveQuestion {
  answer   : string;
  text     : string;
  subtext? : string;
}


export default defineComponent({
  components: {
    'ee-text'       : eeTextVue,
    'ee-input'      : eeInputVue,
    'ee-button'     : eeButtonVue,
    'ee-form-error' : eeFormErrorVue,
  },
  props: {
    id        : { type: String  as PropType<string>,         required: true       },
    type      : { type: Number  as PropType<number>,         required: true       },
    questions : { type: Array   as PropType<FormQuestion[]>, default: () => []    },
    nameLabel : { type: String  as PropType<string>,         default: 'Your Name' },
    showBack  : { type: Boolean as PropType<boolean>,        default: false       },
    minchars  : { type: Number  as PropType<number>,         default: 100         },
    maxchars  : { type: Number  as PropType<number>,         default: 500         },
  },
  emits: ['back', 'submitted'],
  setup(props, ctx) {
    const api             = useAPI();
    const store           = useStore<VuexStore>();
    const nameRegex       = /^[a-z\s.]+$/i;
    const oldQuestions    = store.state.dataCache[props.id] as ReactiveQuestion[]|undefined;
    const questions       = oldQuestions || getReactiveQuestions();
    const inputValidation = useInputValidation(2 + props.questions.length);
    const formData        = reactive({ name: '', email: '', });
    const formState       = reactive({ errorUpdate: 0, errorText: '' });

    if (!props.questions.length) throw Error('qnaform::Missing Questions');
    if (!oldQuestions) store.commit('data-cache-add', { name: props.id, data: questions });

    function submit() {
      const qData = {
        ...formData,
        type: props.type,
        questions: questions.map(q => ({ text: q.text, answer: q.answer }))
      };
      api
        .post('/form/qna', qData)
        .then(() => {
          // Clear answers in cache
          store.commit('data-cache-add', { name: props.id, data: getReactiveQuestions() });
          ctx.emit('submitted');
        })
        .catch(setFormError)
      ;
    }

    function getReactiveQuestions() {
      return props.questions.map(q => reactive({ ...q, answer: q.answer || ''}));
    }

    function setFormError(err: APIErrorResp) {
      formState.errorUpdate = Date.now();
      formState.errorText = err.message;
    }

    return {
      ...toRefs(formData),
      ...toRefs(formState),
      validateInput: inputValidation.validate,
      remainingInputs: inputValidation.remaining,
      areInputsValidated: inputValidation.isValidated,
      questionRefs: questions,
      isSubmitting: api.isPending,
      submit,
      nameRegex,
    };
  }
});

</script>


