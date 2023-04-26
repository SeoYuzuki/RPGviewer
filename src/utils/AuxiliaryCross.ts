import { ref, Ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "vue";

/**
 * 十字線事件，包含監聽鍵盤事件
 */
export default function () {
    // 十字線
    let ox = document.createElement('div');
    let oy = document.createElement('div');
    ox.style.width = '100%';
    ox.style.height = '1px';
    ox.style.backgroundColor = '#ddd';
    ox.style.position = 'fixed';
    ox.style.left = "0";
    ox.style.pointerEvents = "none"
    document.body.appendChild(ox);
    oy.style.height = '100%';
    oy.style.width = '1px';
    oy.style.backgroundColor = '#ddd';
    oy.style.position = 'fixed';
    oy.style.top = "0";
    oy.style.pointerEvents = "none"
    document.body.appendChild(oy);

    /** 是否顯示十字線 */
    let openAuxiliaryCross = ref<boolean>(false);

    const hindAuxiliaryCross = function () {
        ox.style.visibility = "hidden";
        oy.style.visibility = "hidden";
    }

    /**
     * 
     * @param this 
     * @param ev 
     */
    function auxiliaryCrossHandler(this: Window, ev: MouseEvent): any {
        if (openAuxiliaryCross.value) {
            let e = ev;
            let y = ev?.pageY;
            if (y > 70) {
                ox.style.top = e.pageY + 'px';
                oy.style.left = e.pageX + 'px';
                ox.style.visibility = "visible";
                oy.style.visibility = "visible";
            } else {
                hindAuxiliaryCross();
            }
        } else {
            hindAuxiliaryCross();
        }
    }

    //let auxiliaryCrossHandler = getAuxiliaryCrossHandler(openAuxiliaryCross);
    onMounted(() => {
        window.addEventListener("keydown", (e) => {
            if (e.altKey) {
                if (e.key == "s") {
                    openAuxiliaryCross.value = !openAuxiliaryCross.value;
                }
            }
        });

        window.addEventListener("mousemove", auxiliaryCrossHandler);
    });

    onUnmounted(() => {
        window.removeEventListener("mousemove", auxiliaryCrossHandler);
    });

    return {
        /** 是否開啟十字線 */
        openAuxiliaryCross
    };
}