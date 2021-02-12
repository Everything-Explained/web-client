<template>
  <div class="ee-input__container">
    <input class="ee-input__text"
      v-if="type != 'area'"
      @input="$emit('update:modelValue', getVal($event))"
      :id='id'
      :type="type"
      :maxlength="maxchars"
      :value='modelValue'
      placeholder="placeholder"
    >
    <label v-if="type != 'area'" class="ee-input__label" :for='id'><slot></slot></label>

    <textarea :class="['ee-input__area', { '--limit-reached': charLimitReached }]"
      v-if="type == 'area'"
      @input="onAreaInput($event), $emit('update:modelValue', getVal($event))"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxchars"
    ></textarea>

    <span :class="['ee-input__bar', { '--limit-reached': charLimitReached }]"></span>
    <transition name='fade'>
      <span :class="[
                      'ee-input__char-limit',
                      { '--length-reached': charLengthReached,
                        '--limit-reached' : charLimitReached }
                    ]"
          v-if="showCharLength"
        >{{ charLength }}&nbsp;/&nbsp;{{ maxchars }}
      </span>
    </transition>
    <transition name='fade'>
      <span class="ee-input__char-limit-msg"
        v-if="showCharLimit"
      >
        <span class="num">{{ charsRequired }}</span> more chars required
      </span>
    </transition>
  </div>
</template>


<script lang='ts'>
import { computed, defineComponent, ref } from "vue";


const _inputTypes = ['text', 'area', 'email', 'password'];


export default defineComponent({
  props: {
    name        : { type: String  , default: null   },
    type        : { type: String  , default: 'text' },
    minchars    : { type: Number  , default: 30     },
    maxchars    : { type: Number  , default: 255    },
    showchars   : { type: Boolean , default: false  },
    placeholder : { type: String },
    modelValue  : { type: String },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const { placeholder, maxchars, minchars, type, showchars } = props;
    const charLength = ref(0);
    const charsRequired = computed(() => minchars - charLength.value)
    const showCharLimit = computed(() =>
      showchars && charLength.value > 0 && charsRequired.value > 0
    )
    const showCharLength    = computed(() => type == 'area' && charLength.value > 0);
    const charLimitReached  = computed(() => charsRequired.value <= 0);
    const charLengthReached = computed(() => charLength.value == maxchars);

    if (maxchars > 255 && type == 'text')
      throw Error('ee-input:: text input has a 255 character max-limit.')
    ;
    if (!_inputTypes.includes(props.type)) throw Error('ee-input:: invalid input type')

    function genID() {
      const base36RndNum = Math.floor(Math.random() * 10000).toString(36);
      const base36Time = Date.now().toString(36);
      return `i${base36Time}${base36RndNum}`;
    }

    function autoHeight(el: HTMLTextAreaElement) {
      el.style.height = '44px';
      el.style.height = `${el.scrollHeight}px`;
    }

    function onAreaInput(e: Event) {
      const el = e.target as HTMLTextAreaElement;
      autoHeight(el);
      charLength.value = el.value.length;
    }

    return {
      id: type == 'text' ? genID() : '',
      type, minchars, maxchars, placeholder, charLength, charsRequired, showCharLimit,
      charLengthReached, charLimitReached, showCharLength,
      getVal: (e: Event) => (e.target as HTMLInputElement).value,
      onAreaInput,
    };
  }
});
</script>