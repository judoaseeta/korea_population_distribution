import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
// hooks
import { useSortedAddress } from './hooks'
// type
import { NodeChildrenProps } from './type/view'
// component
import PopulationNode from './PopulationNode'
export default function NodeChildren({
    isNodeToggled,
    nestedMap,
    nextDepth,
    parentAddress,
    year,
}: NodeChildrenProps): JSX.Element | null {
    const sortedAddresses = useSortedAddress({
        nodes: nestedMap,
        year,
    })
    return (
        <ul id={parentAddress}>
            {isNodeToggled &&
                sortedAddresses?.map((childAddress, dIndex, arr) => {
                    return (
                        <PopulationNode
                            key={`${parentAddress}_${childAddress}`}
                            address={childAddress}
                            depth={nextDepth}
                            nestedMap={nestedMap?.get(childAddress)}
                            parentAddress={parentAddress}
                            notLastItem={dIndex !== arr.length - 1}
                            year={year}
                        />
                    )
                })}
        </ul>
    )
}
