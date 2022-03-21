// tailwind
import colors from 'tailwindcss/colors'
import { scaleOrdinal } from 'd3-scale'
import { schemeRdBu } from 'd3-scale-chromatic'
// entity
import {
    populationAgeKeys,
    Data,
    PopulationKeyByAge,
    PopulationKeyByGender,
    PopulationReduceType,
    PopulationAliasByGender,
    populationGenderMap,
    TotalKeyByYear,
    TotalKeyByYearAndGender,
    Year,
    NestedMap,
    NestedMapObj,
    AgeKeyByYearAndGender,
    GenderKey,
} from '../type/entity'

export const getBgColorByDepth = (depth: number) => {
    if (depth === 1) {
        return colors.blue['50']
    }
    switch (depth) {
        case 1: {
            return colors.blue['50']
        }
        case 2: {
            return colors.blue['100']
        }
        case 3: {
            return colors.blue['200']
        }
        case 4: {
            return colors.blue['300']
        }
        default:
            return colors.blue['50']
    }
}

export const getPixelNumFromRem = (rem: number) => {
    return Math.floor(parseFloat(getComputedStyle(document.documentElement).fontSize) * rem)
}

export const getPopulationTotalKey = (
    year: Year,
    gender: PopulationKeyByGender,
): TotalKeyByYear | TotalKeyByYearAndGender => {
    if (gender === '_total') {
        return `${year}${gender}`
    }
    return `${year}${gender}_total`
}
export const getPopulationAgeKeys = (year: Year, gender: GenderKey): AgeKeyByYearAndGender[] => {
    return populationAgeKeys.map((ageKey) => `${year}${gender}${ageKey}`) as AgeKeyByYearAndGender[]
}
export const reducePopulationToOne = (data: Data[]): Record<string, number> | undefined => {
    if (data.length > 0) {
        const reduced: Record<string, number> = {}
        data.forEach((d) => {
            const keys = Object.keys(d)
            keys.forEach((key) => {
                if (reduced[key]) {
                    reduced[key] += d[key] ? parseFloat(d[key].replace(',', '')) : 0
                } else {
                    reduced[key] = d[key] ? parseFloat(d[key].replace(',', '')) : 0
                }
            })
        })
        return reduced
    } else {
        return undefined
    }
}

export const colorScaleByAge = (stringifiedIndices: string[]) => {
    return scaleOrdinal<string>().domain(stringifiedIndices.reverse()).range(schemeRdBu[11])
}

export const getCompositionKeyWithData = (data: Data) => {
    let compositionKey = data.address1
    for (let i = 2; i < 4; i += 1) {
        const addressKey = `address${i}`
        if (!data[addressKey]) {
            break
        } else {
            const nextAddressKey = `address${i + 1}`
            if (!data[nextAddressKey]) {
                break
            } else {
                compositionKey += `/${data[addressKey]}`
            }
        }
    }
    return compositionKey
}
export const getCompositeAddress = (data: Data, seperator: string = ' ') => {
    let compositeAddress = data.address1
    if (data.address2) {
        compositeAddress += seperator + data.address2
    }
    if (data.address3) {
        compositeAddress += seperator + data.address3
    }
    if (data.address4) {
        compositeAddress += seperator + data.address4
    }
    return compositeAddress
}

export const isLastDepth = (data: Data[], address: string, depth: number) => {
    if (data.length !== 1) {
        return false
    } else {
        if (depth === 4) {
            return true
        } else {
            const firstData = data[0]
            const nextDepth = depth + 1
            const nextAddressKey = `address${nextDepth}`
            return firstData[nextAddressKey] ? false : true
        }
    }
}

const searchMap = (map: Map<string, NestedMapObj>, data: Data, index: number = 1) => {
    if (index > 4) {
        return
    }
    const currentAddressKey = `address${index}`
    const currentAddressData = data[currentAddressKey]
    if (currentAddressData) {
        if (map.has(currentAddressData)) {
            const oldMap = map.get(currentAddressData)!
            map.set(currentAddressData, {
                rawData: [...oldMap.rawData, data],
                children: oldMap.children,
            })
            const nextAddressKey = `address${index}`
            const nextAddressData = data[nextAddressKey]

            if (nextAddressData) {
                if (oldMap.children) {
                    searchMap(oldMap.children!, data, index + 1)
                } else {
                    map.set(currentAddressData, {
                        rawData: [...oldMap.rawData, data],
                        children: new Map<string, NestedMapObj>(),
                    })
                    searchMap(map.get(currentAddressData)!.children!, data, index + 1)
                }
            } else {
                return
            }
        } else {
            const nextAddressKey = `address${index + 1}`
            const nextAddressData = data[nextAddressKey]

            map.set(currentAddressData, {
                rawData: [data],
                children: nextAddressData ? new Map<string, NestedMapObj>() : undefined,
            })
            if (nextAddressData) {
                searchMap(map.get(currentAddressData)!.children!, data, index + 1)
            } else {
                return
            }
        }
    } else {
        return
    }
}
export const createNestedMap = (data: Data[]) => {
    const resultMap = new Map<string, NestedMapObj>()
    data.forEach((d) => {
        searchMap(resultMap, d)
    })
    return resultMap
}
export const addPopulationToMap = (map: Map<string, NestedMapObj>) => {
    const keys = [...map.keys()]
    keys.forEach((key) => {
        const childMap = map.get(key)
        if (childMap) {
            childMap.populations = reducePopulationToOne(childMap.rawData)
            if (childMap.children) {
                addPopulationToMap(childMap.children)
            }
        }
    })
}

export function numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
