import React from 'react'
import { motion } from 'framer-motion'
//entity
import { sortTypes, sortTypeAliases } from './type/entity'
// hooks
import { useSortType } from './hooks'
// styles
import classnames from 'classnames/bind'
import styles from './sortBar.module.scss'
const cx = classnames.bind(styles)
export default function SortBar(): JSX.Element {
    const { sortType: currentSortType, onClickSortType } = useSortType()
    return (
        <ul className="flex items-center gap-1  bg-slate-50 border border-border">
            {sortTypes.map((sortType) => {
                const key = `sortType_${sortType}`
                return (
                    <li
                        className="relative p-1 cursor-pointer select-none"
                        key={key}
                        onClick={onClickSortType(sortType)}
                    >
                        <p className="text-sm">{sortTypeAliases[sortType]}</p>
                        {sortType === currentSortType && (
                            <motion.div
                                layoutId="selector"
                                className="absolute w-full h-full top-0 left-0 border-2 border-treeLine"
                            ></motion.div>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}
