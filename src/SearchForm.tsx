import React, { useCallback, useEffect, useState, useRef, Suspense } from 'react'
import { useSetRecoilState } from 'recoil'
import { addressExpandedStackAtom, nodeMapAtom } from './state'
// public

// hooks
import { useRawPopulationData, useYears } from './hooks'
// usecase
import { getCompositeAddress, getCompositionKeyWithData } from './usecase'
// type
import { SearchFormProps } from './type/view'
import { Data, years } from './type/entity'
export default function SearchForm() {
    const data = useRawPopulationData()
    const formRef = useRef<HTMLFormElement | null>(null)
    const listRef = useRef<HTMLUListElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [keyword, setKeyword] = useState('')
    const [selectedData, setSelectedData] = useState<Data[]>([])
    const [isResultOn, setIsResultOn] = useState(false)
    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const value = e.target.value
            setKeyword(value)
            if (data && value.length > 1) {
                const result = data.filter((d) => getCompositeAddress(d).includes(value))
                setSelectedData(result)
                if (result.length > 0) {
                    setIsResultOn(true)
                }
            } else {
                setSelectedData([])
            }
        },
        [data],
    )
    const onSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()
    }
    const setNodeMapAtom = useSetRecoilState(nodeMapAtom)
    const setStack = useSetRecoilState(addressExpandedStackAtom)
    const onToggleNode = useCallback(
        (compositeAddress) => {
            let targetAddress = ''
            setNodeMapAtom((oldMapAtom) => {
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
                targetAddress = currentDepthAddress
                return newMapAtom
            })
            setStack((oldStacks) => [...oldStacks, targetAddress])
        },
        [setNodeMapAtom, setStack],
    )
    const onClickAddress: (data: Data) => React.MouseEventHandler = useCallback(
        (d) => () => {
            if (inputRef.current) {
                inputRef.current.blur()
                setIsResultOn(false)
                onToggleNode(getCompositionKeyWithData(d))
            }
        },
        [inputRef, onToggleNode],
    )
    const onEnteraddress: (data: Data) => React.KeyboardEventHandler = useCallback(
        (d) => (e) => {
            if (e.key === 'Enter') {
                setIsResultOn(false)
                onToggleNode(getCompositionKeyWithData(d))
            }
        },
        [onToggleNode],
    )
    const onPressEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Esc' || e.key === 'Escape') {
                setIsResultOn(false)
                const input = inputRef.current
                if (input) {
                    input.blur()
                }
            }
        },
        [inputRef],
    )
    const onClickOut = useCallback(
        (e: MouseEvent) => {
            const form = formRef.current

            if (form) {
                if (!form.contains(e.target as Node)) {
                    setIsResultOn(false)
                }
            }
        },
        [formRef],
    )
    useEffect(() => {
        document.addEventListener('mousedown', onClickOut, true)
        document.addEventListener('keydown', onPressEsc)
    }, [])
    const { year, onChangeYear } = useYears()
    return (
        <div className="relative w-screen flex flex-row gap-2 justify-center items-center p-2  mb-5 ">
            <label className="flex items-center gap-2" htmlFor="population_year">
                <h4 className="select-none">조회 연도</h4>
                <select
                    id="population_year"
                    className="p-1 rounded-sm border border-border "
                    value={year}
                    onChange={onChangeYear}
                >
                    {years.map((year) => {
                        const key = `year_option_${year}`
                        return (
                            <option value={year} key={key}>
                                {year}
                            </option>
                        )
                    })}
                </select>
            </label>
            <form className="w-1/3 h-full relative flex items-center mb-0" onSubmit={onSubmit} ref={formRef}>
                <input
                    type="text"
                    onChange={onChange}
                    value={keyword}
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                            const list = document.getElementById('search_result')
                            if (list) {
                                const listItems = Array.from(list.querySelectorAll('li'))
                                if (document.activeElement === listItems[listItems.length - 1]) {
                                    e.preventDefault()
                                    listItems[0].focus()
                                }
                            }
                        }
                    }}
                    onFocus={(e) => {
                        if (selectedData.length > 0) {
                            setIsResultOn(true)
                        }
                    }}
                    className="outline-0 border border-black w-full p-1 text-sm"
                />
                {isResultOn && (
                    <ul
                        className=" border-l border-r border-black absolute bottom-0 left-0  w-full translate-y-full bg-white z-50 max-h-[40rem] overflow-y-auto shadow-lg shadow-slate-500/50"
                        ref={listRef}
                        id="search_result"
                    >
                        {selectedData.map((data) => {
                            const compositeAddress = getCompositeAddress(data)

                            const key = `search_result_${compositeAddress}`
                            const regex = new RegExp(`${keyword}`, 'gi')
                            const regexExec = regex.exec(compositeAddress)
                            return (
                                <li
                                    className="h-ih flex items-center bg-slate-50 border-b border-orange-400 pl-2 focus:bg-slate-200/80 focus:outline-0"
                                    key={key}
                                    tabIndex={0}
                                    onKeyDown={onEnteraddress(data)}
                                >
                                    {regexExec && (
                                        <p
                                            className="text-ssm cursor-pointer hover:underline "
                                            onClick={onClickAddress(data)}
                                        >
                                            {compositeAddress.slice(0, regexExec.index)}
                                            <span className="bg-orange-400 text-white p-1">{regexExec[0]}</span>
                                            {compositeAddress.slice(regexExec.index + keyword.length)}
                                        </p>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </form>
        </div>
    )
}
