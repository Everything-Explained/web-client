<template>
  <div class="ee-input__container">
    <!-- TEXT FIELD -->
    <input
      v-if="isTextField"
      :id="id"
      :class="['ee-input__text', { '--limit-reached': charLimitReached && hasValidInput }]"
      :type="type"
      :minlength="minchars"
      :maxlength="maxchars"
      :value="modelValue"
      placeholder="placeholder"
      @input="onInput($event), $emit('update:modelValue', getVal($event))"
    >
    <!-- Floating LABEL -->
    <label
      v-if="isTextField"
      class="ee-input__label"
      :for="id"
    ><slot /></label>

    <textarea
      v-if="type == 'area'"
      :id="id"
      ref="areaText"
      :class="['ee-input__area', { '--limit-reached': charLimitReached }]"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxchars"
      @keyup="validate(charLimitReached && hasValidInput, id)"
      @input="onInput($event), $emit('update:modelValue', getVal($event))"
    />

    <!-- Animated Bottom Border -->
    <span :class="['ee-input__bar', { '--limit-reached': charLimitReached && hasValidInput }]" />

    <!-- Character Length Tally **/** -->
    <transition name="fade">
      <span
        v-if="isTextField ? showCharTally && tally : tally || showCharTally"
        :class="[
          'ee-input__char-limit',
          { '--length-reached': charLengthReached,
            '--limit-reached' : charLimitReached }
        ]"
      >
        {{ charLength }}&nbsp;/&nbsp;{{ maxchars }}
      </span>
    </transition>
    <transition name="fade">
      <span
        v-if="isTextField ? showCharLimit && tally : showCharLimit"
        class="ee-input__char-limit-msg"
      >
        <em>{{ charsRequired }}</em> more chars required
      </span>
      <span
        v-else-if="!hasValidInput && charLength > 0"
        class="ee-input__error-msg"
        v-html="errorMessage"
      />
    </transition>
  </div>
</template>


<script lang='ts'>
import useUniqueIDGen from "@/composeables/useUniqueID";
import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";


type ValidateFn = (val: boolean, id: string) => void;

const _inputTypes = ['text', 'area', 'email', 'password'];


export default defineComponent({
  props: {
    name        : { type: String  , default: ''               },
    type        : { type: String  , default: 'text'           },
    minchars    : { type: Number  , default: 0                },
    maxchars    : { type: Number  , default: 255              },
    tally       : { type: Boolean , default: false            },
    regex       : { type: RegExp  , default: /.*/             },
    errmsg      : { type: String  , default: '<b>Invalid</b>' },
    placeholder : { type: String  , default: ''               },
    modelValue  : { type: String  , default: ''               },
    validate    : { type: Function as PropType<ValidateFn>, default: () => void(0)    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const { maxchars, minchars, type, regex, errmsg } = props;
    const id                = useUniqueIDGen().genID();
    const charLength        = ref(0);
    const areaText          = ref<HTMLTextAreaElement>();
    const isTextField       = type == 'text' || type == 'email';
    const emailRegex        = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const workingRegex      = type == 'email' ? emailRegex : regex;
    const hasValidInput     = computed(() => workingRegex.test(props.modelValue));
    const errorMessage      = computed(() => type == 'email' ? "Enter a <em>valid</em> E-mail" : errmsg);
    const charsRequired     = computed(() => minchars - charLength.value);
    const showCharLimit     = computed(() => charLength.value > 0 && charsRequired.value > 0);
    const showCharTally     = computed(() => charLength.value > 0);
    const charLimitReached  = computed(() => charsRequired.value <= 0);
    const charLengthReached = computed(() => charLength.value == maxchars);
    const isValidated       = computed(() => charLimitReached.value && hasValidInput.value);

    if (maxchars > 255 && isTextField)
      throw Error('ee-input:: text input has a 255 character max-limit.')
    ;
    if (!_inputTypes.includes(props.type)) throw Error('ee-input:: invalid input type');

    function autoHeight(el: HTMLTextAreaElement) {
      el.style.height = '44px';
      el.style.height = `${el.scrollHeight}px`;
    }

    function onInput(e: Event) {
      const el = e.target as HTMLTextAreaElement;
      const val = el.value;
      if (type == 'area') autoHeight(el);
      charLength.value = val.length;
    }

    // onValidation
    watch(() => isValidated.value,
      (val: boolean) => { props.validate(val, id); }
    );

    onMounted(() => {
      // Update textarea if it starts with a value.
      if (props.modelValue.length) {
        charLength.value = props.modelValue.length;
        autoHeight(areaText.value!);
      }
    });

    return {
      id,
      charLength, charsRequired, showCharLimit, isTextField,
      areaText, errorMessage,
      charLengthReached, charLimitReached, showCharTally,
      getVal: (e: Event) => (e.target as HTMLInputElement).value,
      hasValidInput,
      onInput, autoHeight
    };
  },
});
</script>