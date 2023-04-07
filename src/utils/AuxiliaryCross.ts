import { Ref } from "@vue/reactivity";

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

/**
 * 顯示十字線
 * @param openAuxiliaryCross 是否顯示十字線
 */
const getAuxiliaryCrossHandler = function (openAuxiliaryCross: Ref<boolean>) {
    let temp = function (this: Window, ev: MouseEvent): any {
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
    return temp;
}

const hindAuxiliaryCross = function () {
    ox.style.visibility = "hidden";
    oy.style.visibility = "hidden";
}


export { getAuxiliaryCrossHandler  }