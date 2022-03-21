import { InternMap } from 'd3-array'
import React, { useState, useCallback, useEffect, useMemo, ReactText } from 'react'
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
// api
import getData from '../getData'
// entity
import { AddressFunc, Data, SortType, Year, NestedMap } from '../type/entity'
// usecase
import { getPopulationTotalKey } from '../usecase'
// state - recoil
import {
    populationYear,
    rawPopulationData,
    addressExpandedStackAtom,
    nodeSelector,
    nodeMapAtom,
    nodeMapSelector,
    sortTypeAtom,
} from '../state'

interface UseSortedAddressProps {
    nodes?: NestedMap
    year: Year
}

export const useSortedAddress = ({ nodes, year }: UseSortedAddressProps) => {
    const sortType = useRecoilValue(sortTypeAtom)
    const yearTotalKey = getPopulationTotalKey(year, '_total')
    return useMemo(() => {
        if (nodes) {
            const unsortedKeys = [...nodes.keys()]
            if (sortType) {
                switch (sortType) {
                    case 'address_ascend': {
                        return unsortedKeys.sort((a, b) => b.localeCompare(a))
                    }
                    case 'address_descend': {
                        return unsortedKeys.sort((a, b) => a.localeCompare(b))
                    }
                    case 'population_ascend': {
                        return unsortedKeys.sort((a, b) => {
                            const aNode = nodes.get(a)
                            const aPopulation = aNode ? (aNode.populations ? aNode.populations[yearTotalKey] : 0) : 0
                            const bNode = nodes.get(b)
                            const bPopulation = bNode ? (bNode.populations ? bNode.populations[yearTotalKey] : 0) : 0
                            return bPopulation - aPopulation
                        })
                    }
                    case 'population_descend': {
                        return unsortedKeys.sort((a, b) => {
                            const aNode = nodes.get(a)
                            const aPopulation = aNode ? (aNode.populations ? aNode.populations[yearTotalKey] : 0) : 0
                            const bNode = nodes.get(b)
                            const bPopulation = bNode ? (bNode.populations ? bNode.populations[yearTotalKey] : 0) : 0
                            return aPopulation - bPopulation
                        })
                    }
                    default: {
                        return unsortedKeys
                    }
                }
            }
            return unsortedKeys
        }
    }, [nodes, sortType])
}

export function useCompositeAddress(keys?: string[]) {
    const [compositeAddresses, setCompositeAddresses] = useState<{ [key: string]: string } | null>(null)
    useEffect(() => {
        if (keys) {
            const newCompositedAddresses = keys.reduce(
                (acc, curr) => ({ ...acc, [curr]: '' }),
                {} as { [key: string]: string },
            )
            setCompositeAddresses(newCompositedAddresses)
        }
    }, [keys])
    const onAddAddress = useCallback(
        (addressKey: string) => (addAddressFunc: AddressFunc) => {
            setCompositeAddresses((compositeAddresses) => {
                if (compositeAddresses) {
                    return {
                        ...compositeAddresses,
                        [addressKey]: addAddressFunc(compositeAddresses[addressKey]),
                    }
                }
                return compositeAddresses
            })
        },
        [compositeAddresses],
    )
    const onRemoveAddress = useCallback(
        (addressKey: string) => (removeAddressFunc: AddressFunc) => {
            setCompositeAddresses((compositeAddresses) => {
                if (compositeAddresses) {
                    console.log('res', removeAddressFunc(compositeAddresses[addressKey]))
                    return {
                        ...compositeAddresses,
                        [addressKey]: removeAddressFunc(compositeAddresses[addressKey]),
                    }
                }
                return compositeAddresses
            })
        },
        [compositeAddresses],
    )
    return {
        compositeAddresses,
        onAddAddress,
        onRemoveAddress,
    }
}

export function useRawPopulationData() {
    const rawData = useRecoilValue(rawPopulationData)
    return rawData
}

export function useOnToggleNode(compositeAddress: string, isNodeToggled: boolean) {
    const [_, setStack] = useRecoilState(addressExpandedStackAtom)
    return useRecoilCallback(
        ({ set }) =>
            () => {
                set(nodeMapAtom, (oldMapAtom) => {
                    if (isNodeToggled) {
                        const newMapAtom = new Map(oldMapAtom)
                        const newMapKeys = oldMapAtom.keys()
                        for (let mapKey of newMapKeys) {
                            if (mapKey.includes(compositeAddress)) {
                                newMapAtom.delete(mapKey)
                            }
                        }
                        return newMapAtom
                    } else {
                        const newMapAtom = new Map(oldMapAtom)
                        const decomposedAddress = compositeAddress.split('/')
                        let currentDepthAddress = ''

                        for (let i = 0; i < decomposedAddress.length; i += 1) {
                            currentDepthAddress = currentDepthAddress
                                ? currentDepthAddress + `/${decomposedAddress[i]}`
                                : decomposedAddress[i]
                            if (!newMapAtom.has(currentDepthAddress)) {
                                newMapAtom.set(currentDepthAddress, true)
                            }
                        }
                        //최종 하위 주소값을 스택에 push.
                        // setStack((oldStack) => [...oldStack, currentDepthAddress])
                        return newMapAtom
                    }
                })
            },
        [compositeAddress, isNodeToggled],
    )
}
export function useNodeToggled(compositeAddress: string) {
    const isNodeToggled = useRecoilValue(
        nodeMapSelector({
            compositeAddress,
        }),
    )
    const onToggleNode = useOnToggleNode(compositeAddress, isNodeToggled)
    return {
        isNodeToggled,
        onToggleNode,
    }
}

export const useYears = () => {
    const [year, setYear] = useRecoilState(populationYear)
    const onChangeYear: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
        const newYear = e.target.value as Year
        setYear(newYear)
    }, [])
    return {
        year,
        onChangeYear,
    }
}

export const useSortType = () => {
    const [sortType, setSortType] = useRecoilState(sortTypeAtom)
    const onClickSortType: (type: SortType) => React.MouseEventHandler = useCallback(
        (type) => () => {
            setSortType(type)
        },
        [],
    )
    return {
        sortType,
        onClickSortType,
    }
}
