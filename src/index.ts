// @ts-nocheck
import { createApp, onMounted, ref, watch } from 'vue/dist/vue.esm-bundler';

import { createSpinner, EventEnum } from './lucky-wheel';

createApp({
  setup() {

    const spinnerInstance = createSpinner();
    const pieceLength = ref(8);
    const isRotate = ref(false);


    function startRotation() {
      spinnerInstance.rotation(spinnerInstance.getRandom(1, pieceLength.value));
    }

    watch(pieceLength, (val) => {
      spinnerInstance.init(val);
    })

    onMounted(() => {
      spinnerInstance.init(pieceLength.value);

      spinnerInstance.addEventListener(EventEnum.RotationStart, () => {
        isRotate.value = true;
      })
      spinnerInstance.addEventListener(EventEnum.RotationEnd, (val: number) => {
        isRotate.value = false;
        alert(val)
      })
    })


    return {
      pieceLength,
      isRotate,
      startRotation
    }
  }
}).mount('#app')


