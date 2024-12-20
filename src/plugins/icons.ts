// src/plugins/icons.ts
import { h } from 'vue'
import type { IconSet, IconProps } from 'vuetify'
import { 
    mdiHome,
    mdiPlay,
    mdiTestTube,
    mdiArrowRightBoldBox,
    mdiArrowLeftBoldBox,
    mdiFormatListBulleted,
    mdiPencil,
    mdiDelete,
    mdiPlus,
    mdiSchool,
    mdiHumanMaleBoard,
    mdiLightbulbOn,
    mdiArrowLeft,
    mdiEye,
    mdiEyeOff
} from '@mdi/js'

export const icons = {
    home: mdiHome,
    play: mdiPlay,
    testTube: mdiTestTube,
    arrowRightBox: mdiArrowRightBoldBox,
    arrowLeftBox: mdiArrowLeftBoldBox,
    list: mdiFormatListBulleted,
    pencil: mdiPencil,
    delete: mdiDelete,
    plus: mdiPlus,
    school: mdiSchool,
    teacher: mdiHumanMaleBoard,
    lightbulb: mdiLightbulbOn,
    arrowLeft: mdiArrowLeft,
    eye: mdiEye,
    eyeOff: mdiEyeOff
}

const customSvgNamespace: IconSet = {
    component: (props: IconProps) => {
        const { icon } = props
        return h('span', {
            class: ['mdi-custom'],
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;">
                <path fill="currentColor" d="${icon}"></path>
            </svg>`
        })
    }
}

export { customSvgNamespace }