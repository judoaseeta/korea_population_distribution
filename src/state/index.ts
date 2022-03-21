import { atom, atomFamily, selector, selectorFamily } from 'recoil'
import getData from '../getData'
// entity
import { Year, SortType } from '../type/entity'
// recoil related
export const sortTypeAtom = atom<SortType>({
    key: 'sortType',
    default: 'population_ascend',
})
export const populationYear = atom<Year>({
    key: 'populationYear',
    default: '2021',
})

export const rawPopulationData = selector({
    key: 'rawPopulationData',
    get: async () => {
        const result = await getData()
        return result
    },
})

export const searchedAddressAtom = atom({
    key: 'searchedAddress',
    default: '서울특별시/종로구',
})

export const nodeMapAtom = atom<Map<string, boolean>>({
    key: 'nodeMapAtom',
    default: new Map(),
})
export const toggledAddressLengthAtom = selector({
    key: 'toggledAddressLength',
    get: ({ get }) => get(nodeMapAtom).size,
})
export const nodeMapSelector = atomFamily<
    boolean,
    {
        compositeAddress: string
    }
>({
    key: 'nodeMapSelectorAtom',
    default: selectorFamily({
        key: 'nodeMapSelectorAtom/default',
        get:
            ({ compositeAddress }) =>
            ({ get }) => {
                const nodeMap = get(nodeMapAtom)
                const decomposedAddress = compositeAddress.split('/')
                let currentDepthAddress = ''

                for (let i = 0; i < decomposedAddress.length; i += 1) {
                    currentDepthAddress = currentDepthAddress
                        ? currentDepthAddress + `/${decomposedAddress[i]}`
                        : decomposedAddress[i]

                    if (!nodeMap.has(currentDepthAddress)) {
                        return false
                    }
                }
                return true
            },
    }),
})

export const nodeSelector = atomFamily<
    boolean,
    {
        address: string
    }
>({
    key: 'nodeSelector',
    default: false,
})

export const addressExpandedStackAtom = atom<string[]>({
    key: 'addressExpandedStackAtom',
    default: [],
})
export const addressExpandedStackSelector = selector<string>({
    key: 'addressExpandedStackSelector',
    get: ({ get }) => {
        const stack = get(addressExpandedStackAtom)
        return stack.pop() || ''
    },
    set: ({ get, set }, newAddress) => {
        const oldStack = get(addressExpandedStackAtom)
        set(addressExpandedStackAtom, oldStack.concat(newAddress as string))
    },
})
