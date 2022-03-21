import React, { useRef, useEffect, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
// usecase
import { createNestedMap, addPopulationToMap, getPixelNumFromRem } from './usecase'
// hooks
import { useSortedAddress, useYears, useRawPopulationData } from './hooks'
// state
import { addressExpandedStackAtom } from './state'
// components
import PopulationNode from './PopulationNode'
import SortBar from './SortBar'
//styles
import nodeStyles from './populationNode.module.scss'
import classnames from 'classnames/bind'

const cx = classnames.bind(nodeStyles)
export default function Populations(): JSX.Element {
    const { year } = useYears()
    const rawData = useRawPopulationData()
    const addressStack = useRecoilValue(addressExpandedStackAtom)
    const listRef = useRef<HTMLUListElement | null>(null)
    /**
     * const observerCallback: MutationCallback = useCallback(
        (mutations) => {
            console.log(mutations, addressStack)
            mutations.forEach((mutation) => {
                const list = listRef.current
                if (list && mutation.addedNodes.length > 0) {
                    const firstNode = mutation.addedNodes[0]
                    if (firstNode?.nodeType === firstNode?.ELEMENT_NODE) {
                        const firstEl = firstNode as Element

                        if (firstEl.tagName === 'UL') {
                            const { top: containerTop } = list.getBoundingClientRect()
                            const { top } = firstEl.previousElementSibling!.getBoundingClientRect()

                            console.log(firstEl.previousElementSibling, top, list.scrollTop)
                            list.scrollTo({
                                top: top - containerTop + list.scrollTop,
                                behavior: 'smooth',
                            })
                        }
                    }
                }
            })
        },
        [addressStack, listRef],
    )
     */
    useEffect(() => {
        const list = listRef.current
        if (list) {
            if (addressStack.length > 0) {
                const lastStacked = addressStack[addressStack.length - 1]
                const candidate = document.getElementById(lastStacked)
                if (candidate) {
                    const { top: containerTop } = list.getBoundingClientRect()
                    const { top } = candidate.previousElementSibling!.getBoundingClientRect()

                    list.scrollTo({
                        top: top - containerTop + list.scrollTop,
                        behavior: 'smooth',
                    })
                }
            }
            /**
            * 
            *  const observer = new MutationObserver(observerCallback)
            observer.observe(list, {
                childList: true,
                subtree: true,
            })
            return () => {
                observer.disconnect()
            }
            */
        }
    }, [addressStack, listRef])

    const nodes = useMemo(() => {
        if (rawData) {
            const mapped = createNestedMap(rawData)
            addPopulationToMap(mapped)
            return mapped
        }
    }, [rawData])
    const sortedAddresses = useSortedAddress({
        nodes,
        year,
    })
    return (
        <>
            <SortBar />
            <ul className="flex flex-col  shadow-2xl">
                <li className="h-ih flex items-center border  border-border">
                    <div className={cx(['populationNode', 'bg-slate-50 h-full'])}>
                        <div className="flex w-full justify-between h-full px-3 items-center">
                            <h4 className="text-sm">지역명</h4>
                        </div>
                        <div className="flex   justify-between h-full px-3 items-center">
                            <h4 className="text-sm">인구수</h4>
                        </div>
                        <div className="flex  h-full justify-center  items-center">
                            <h4 className="text-sm">인구분포도</h4>
                        </div>
                        <div className="flex   h-full items-center">
                            <h4 className="text-ssm">하위 행정구역수</h4>
                        </div>
                    </div>
                </li>
                <ul className="flex flex-col  h-[34rem] overflow-y-auto overflow-x-hidden" ref={listRef}>
                    {sortedAddresses &&
                        nodes &&
                        sortedAddresses.map((key, keyIndex, arr) => (
                            <PopulationNode
                                key={key}
                                depth={1}
                                address={key}
                                parentAddress={''}
                                nestedMap={nodes.get(key)}
                                notLastItem={keyIndex !== arr.length - 1}
                                year={year}
                            />
                        ))}
                </ul>
            </ul>
        </>
    )
}
