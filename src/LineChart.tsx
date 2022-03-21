import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
//framer -motion
import { Variants, motion } from 'framer-motion'
//d3
import { scaleBand, scaleLinear } from 'd3-scale'
import { area, curveCardinal } from 'd3-shape'
// state
import { populationYear } from './state'
// usecase
import { getPopulationTotalKey, reducePopulationToOne, getPixelNumFromRem } from './usecase'
// type
import { LineChartProps } from './type/view'
import { years } from './type/entity'

const drawCircle: Variants = {
    hidden: {
        scale: 0,
        fillOpacity: 0,
    },
    visible: {
        scale: 1,
        fillOpacity: 1,
        transition: {
            pathLength: { delay: 1, type: 'spring', duration: 0.5, bounce: 0.2 },
            opacity: { duration: 0.01 },
        },
    },
}

export default function LineChart({ populations, year }: LineChartProps) {
    const dataKeys = useMemo(() => {
        return years.map((year) => getPopulationTotalKey(year, '_total'))
    }, [])

    const populationScale = useMemo(() => {
        if (populations) {
            const populationsNums = dataKeys.map((key) => populations[key])
            return scaleLinear()
                .domain([Math.max(...populationsNums), Math.min(...populationsNums)])
                .range([getPixelNumFromRem(0.8), getPixelNumFromRem(1.6)])
        }
    }, [populations, dataKeys])
    const dataKeysBandScale = useMemo(() => {
        if (dataKeys) {
            return scaleBand()
                .domain(dataKeys)
                .range([20, getPixelNumFromRem(15)])
        }
    }, [dataKeys])

    return (
        <div className="w-60 h-8">
            <svg width={getPixelNumFromRem(15)} height={getPixelNumFromRem(2)}>
                {dataKeys && dataKeysBandScale && populationScale && (
                    <g transform={`translate(0,${getPixelNumFromRem(0.1)})`}>
                        <path
                            d={
                                area<string>()
                                    .curve(curveCardinal)
                                    .x((d) => dataKeysBandScale(d) || 0)
                                    .y0((key) => populationScale(populations[key]) || 0)
                                    .y1(() => getPixelNumFromRem(1.6))(dataKeys) || ''
                            }
                            className="stroke-lineChart fill-lineChart/30"
                            strokeWidth={1}
                        />
                        <motion.circle
                            cx={dataKeysBandScale(`${year}_total`) || 0}
                            cy={populationScale(populations[`${year}_total`])}
                            r={2}
                            className="fill-dot stroke-black"
                            initial="hidden"
                            animate="visible"
                            variants={drawCircle}
                        ></motion.circle>
                    </g>
                )}
            </svg>
        </div>
    )
}
