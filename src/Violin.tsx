import { scaleBand, scaleLinear } from 'd3-scale'
import React, { useMemo, useState } from 'react'
import { populationAgeKeys, PopulationKeyToKorean, Vector } from './type/entity'
// type
import { ViolinProps } from './type/view'
// usecase
import {
    colorScaleByAge,
    getPopulationAgeKeys,
    getPixelNumFromRem,
    reducePopulationToOne,
    numberWithCommas,
} from './usecase'

export default function Violin({ year, populations }: ViolinProps) {
    const manKeys = useMemo(() => {
        return getPopulationAgeKeys(year, '_m')
    }, [year])
    const manData = useMemo(() => {
        return manKeys.map((key) => {
            if (populations[key]) {
                return populations[key]
            }
            return 0
        })
    }, [populations, manKeys])
    const womanKeys = useMemo(() => {
        return getPopulationAgeKeys(year, '_w')
    }, [year])
    const womanData = useMemo(() => {
        return womanKeys.map((key) => {
            if (populations[key]) {
                return populations[key]
            }
            return 0
        })
    }, [populations, womanKeys])
    const pixelRem2 = getPixelNumFromRem(2)
    const pixelRem11 = getPixelNumFromRem(11)
    const womanlineScale = useMemo(() => {
        if (womanData) {
            return scaleLinear()
                .domain([0, Math.max(...womanData)])
                .range([getPixelNumFromRem(0.1), getPixelNumFromRem(0.9)])
        }
    }, [womanData])
    const manlineScale = useMemo(() => {
        if (manData) {
            return scaleLinear()
                .domain([0, Math.max(...manData)])
                .range([0, getPixelNumFromRem(0.9)])
        }
    }, [manData])
    const bandScale = useMemo(() => {
        return scaleBand<number>()
            .domain(manKeys.map((_, idx) => idx))
            .range([0, pixelRem11])
    }, [manKeys])
    const colorScale = useMemo(() => {
        if (manData) {
            return colorScaleByAge(manData.map((_, i) => String(i)))
        }
    }, [manData])
    const [hoveredVector, setHoveredVector] = useState<Vector | null>(null)
    const [hoveredIndex, setHoveredIndex] = useState(-1)
    const onMouseEnter: (index: number) => React.MouseEventHandler = (idx: number) => (e) => {
        setHoveredIndex(idx)
        setHoveredVector({
            x: e.clientX,
            y: e.clientY,
        })
    }
    const onMouseLeave: React.MouseEventHandler = () => {
        setHoveredIndex(-1)
        setHoveredVector(null)
    }
    return (
        <div className="w-full h-ih flex justify-center items-center">
            <svg height={pixelRem2} width={pixelRem11}>
                {manlineScale &&
                    colorScale &&
                    manData &&
                    manKeys.map((key, keyIndex) => {
                        const data = manData[keyIndex]
                        if (data === 0) {
                            return null
                        }
                        const xPos = bandScale(keyIndex) || 0

                        const bandWidth = bandScale.bandwidth()

                        const height = manlineScale(data)
                        const yPos = pixelRem2 / 2 - height
                        const componentKey = `man_${key}_${keyIndex}`
                        const color = colorScale(String(keyIndex))
                        return (
                            <g key={componentKey}>
                                <rect x={xPos} y={yPos} width={bandWidth} height={height} fill={color} stroke="black" />
                            </g>
                        )
                    })}
                <g transform={`translate(0, ${pixelRem2 / 2})`}>
                    {womanlineScale &&
                        colorScale &&
                        womanData &&
                        womanKeys.map((key, keyIndex) => {
                            const data = womanData[keyIndex]
                            if (data === 0) {
                                return null
                            }
                            const xPos = bandScale(keyIndex) || 0
                            const bandWidth = bandScale.bandwidth()

                            const height = womanlineScale(data)
                            const componentKey = `woman_${key}_${keyIndex}`
                            const color = colorScale(String(keyIndex))
                            return (
                                <g key={componentKey}>
                                    <rect
                                        x={xPos}
                                        y={0}
                                        width={bandWidth}
                                        height={height}
                                        fill={color}
                                        stroke="black"
                                    />
                                </g>
                            )
                        })}
                </g>
                {manKeys.map((key, keyIndex) => {
                    const panelkey = `hover_panel_${key}`
                    const xPos = bandScale(keyIndex) || 0

                    return (
                        <rect
                            key={panelkey}
                            onMouseEnter={onMouseEnter(keyIndex)}
                            onMouseLeave={onMouseLeave}
                            x={xPos}
                            y={0}
                            height={pixelRem2}
                            width={bandScale.bandwidth()}
                            className="cursor-pointer fill-slate-300/0 hover:fill-[#14fad1]/50 "
                        />
                    )
                })}
            </svg>
            {manData && womanData && hoveredIndex > -1 && hoveredVector && (
                <div
                    className="fixed top-0 border border-black left-0 z-50 p-1 bg-zinc-100 rounded-sm shadow-sm"
                    style={{
                        transform: `translate(${hoveredVector.x}px, ${hoveredVector.y}px) translateY(20%)`,
                    }}
                >
                    <h4 className="text-sm">연령: {PopulationKeyToKorean[populationAgeKeys[hoveredIndex]]}</h4>
                    <p className="text-ssm">남성: {numberWithCommas(manData[hoveredIndex])}명 </p>
                    <p className="text-ssm">여성: {numberWithCommas(womanData[hoveredIndex])}명</p>
                </div>
            )}
        </div>
    )
}
