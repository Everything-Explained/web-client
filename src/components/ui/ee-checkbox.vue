<template>
  <div class="ee-chkbx__container">
    <input
      :id="chkbxID"
      class="ee-chkbx"
      type="checkbox"
    >
    <label :for="chkbxID" class="ee-chkbx__label">
      <div>
        <svg class="ee-chkbx__checkmark" viewbox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      </div>
      <div>Testing 123</div>
    </label>
  </div>
</template>



<script lang="ts">
import useUniqueIDGen from "@/composeables/useUniqueID";
import { defineComponent } from "@vue/runtime-core";


export default defineComponent({
  setup() {
    const genID = useUniqueIDGen().genID;

    return {
      svgID  : genID(),
      chkbxID: genID(),
    };
  }
});

</script>




