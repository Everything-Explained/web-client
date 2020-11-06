import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const ver     = '36';
    const verType = 'α';
    const verDesc = `
      We shall carry on by 12's until we reach β;
      a shift from the arbitrary past into the ever
      present - a gift to Me, Myself, and I.
    `.trim();

    console.log(`${ver}${verType}`);
    return { ver };
  },
  methods: {
    test() {
      console.log('testing 123');
    }
  }
});