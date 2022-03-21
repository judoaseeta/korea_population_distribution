import React from 'react'
import { motion, Variants, LayoutGroup } from 'framer-motion'
// usecase
import { getPixelNumFromRem } from './usecase'
// types
import { TreeLineProps } from './type/view'
const drawSvg: Variants = {
    hidden: {
        pathLength: 0,
        opacity: 0,
    },
    visible: (index: number) => {
        const delay = (1 + index) * 0.1
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: 'spring', duration: 0.5, bounce: 0 },
                opacity: { delay, duration: 0.01 },
            },
        }
    },
}

export default function TreeLine({ className, compositeAddress, depth, expanded, notLastItem }: TreeLineProps) {
    const pixelRem2 = getPixelNumFromRem(2)
    const pixelRem1 = getPixelNumFromRem(1)
    return (
        <>
            {depth > 1 && (
                <motion.svg
                    width={pixelRem2}
                    height={pixelRem2}
                    data-depth={depth}
                    className={className}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.rect
                        x={pixelRem1}
                        y={0}
                        width={1}
                        height={pixelRem2}
                        className="fill-treeLine"
                        variants={drawSvg}
                        custom={1}
                    />
                </motion.svg>
            )}
            {depth > 2 && (
                <motion.svg
                    width={pixelRem2}
                    height={pixelRem2}
                    data-depth={depth}
                    className={className}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.rect
                        x={pixelRem1}
                        y={0}
                        width={1}
                        height={pixelRem2}
                        className="fill-treeLine"
                        variants={drawSvg}
                        custom={1.5}
                    />
                </motion.svg>
            )}
            {depth > 3 && (
                <motion.svg
                    width={pixelRem2}
                    height={pixelRem2}
                    data-depth={depth}
                    className={className}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.rect
                        x={pixelRem1}
                        y={0}
                        width={1}
                        height={pixelRem2}
                        className="fill-treeLine"
                        variants={drawSvg}
                        custom={1.75}
                    />
                </motion.svg>
            )}
            <motion.svg
                width={pixelRem2}
                height={pixelRem2}
                data-depth={depth}
                className={className}
                initial="hidden"
                animate="visible"
            >
                <motion.rect
                    x={pixelRem1}
                    y={0}
                    width={1}
                    height={pixelRem1}
                    className="fill-treeLine"
                    variants={drawSvg}
                    custom={2}
                />
                <motion.rect
                    x={pixelRem1}
                    y={pixelRem1}
                    width={pixelRem1}
                    height={1}
                    className="fill-treeLine"
                    variants={drawSvg}
                    custom={2}
                />
                {(notLastItem || expanded) && (
                    <motion.rect
                        x={pixelRem1}
                        y={pixelRem1}
                        width={1}
                        height={pixelRem1}
                        className="fill-treeLine"
                        variants={drawSvg}
                        custom={2}
                    />
                )}
            </motion.svg>
            <motion.svg
                height={pixelRem2}
                width={12}
                data-depth={depth}
                className={className}
                initial="hidden"
                animate="visible"
            >
                <motion.rect
                    x={0}
                    y={pixelRem1}
                    width={4}
                    height={1}
                    className="fill-treeLine"
                    variants={drawSvg}
                    custom={3}
                />
                <motion.circle
                    cx={7}
                    cy={pixelRem1}
                    r={3}
                    className={expanded ? 'fill-transparent stroke-treeLine' : 'fill-treeLine stroke-none'}
                    variants={drawSvg}
                    custom={3}
                />
            </motion.svg>
        </>
    )
}
