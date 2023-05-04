import { onMounted, ref } from "vue";

/** 是否按下ctrl */
const isCtrlPress = ref<boolean>(false);
export default function () {
    onMounted(() => {
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                isCtrlPress.value = true
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === 'Control') {
                isCtrlPress.value = false
            }
        });
    });

    return {
        /** 是否按下Ctrl */
        isCtrlPress
    };
}

export { isCtrlPress }