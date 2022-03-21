export interface Data {
    address1: string
    address2: string
    address3: string
    address4: string
    [type: string]: string
}
export const years = ['2016', '2017', '2018', '2019', '2020', '2021'] as const
export type Year = typeof years[number]
export const populationSelection = ['60세 이상', '남', '여', '전체', '40세 미만'] as const
export type PopulationReduceType = typeof populationSelection[number]
export type PopulationKeyByGender = '_total' | '_m' | '_w'

export type GenderKey = '_m' | '_w'
export type PopulationAliasByGender = 'woman' | 'man' | 'total'
export const populationGenderMap: {
    [key in PopulationAliasByGender]: PopulationKeyByGender
} = {
    woman: '_w',
    man: '_m',
    total: '_total',
} as const
export type TotalKeyByYear = `${Year}_total`
export type TotalKeyByYearAndGender = `${Year}${GenderKey}_total`
export const populationAgeKeys = [
    '_0-9',
    '_10-19',
    '_20-29',
    '_30-39',
    '_40-49',
    '_50-59',
    '_60-69',
    '_70-79',
    '_80-89',
    '_90-99',
    '_100',
] as const
export type PopulationKeyByAge = typeof populationAgeKeys[number]
export type AgeKeyByYearAndGender = `${Year}${GenderKey}${PopulationKeyByAge}`
export const PopulationKeyToKorean: {
    [age in PopulationKeyByAge]: string
} = {
    '_0-9': '0세-9세',
    '_10-19': '10세-19세',
    '_20-29': '20세-29세',
    '_30-39': '30세-39세',
    '_40-49': '40세-49세',
    '_50-59': '50세-59세',
    '_60-69': '60세-69세',
    '_70-79': '70세-79세',
    '_80-89': '80세-89세',
    '_90-99': '90세-99세',
    _100: '100세 이상',
}
export interface Vector {
    x: number
    y: number
}

export type AddressFunc = (address: string) => string

export interface INodeMap {
    isToggled: boolean
    children: {
        [key: string]: INodeMap
    }
}
export const sortTypes = ['population_ascend', 'population_descend', 'address_ascend', 'address_descend'] as const
export type SortType = typeof sortTypes[number]
export const sortTypeAliases: {
    [sortType in SortType]: string
} = {
    population_ascend: '인구수 오름차순',
    population_descend: '인구수 내림차순',
    address_ascend: '주소명 오름차순',
    address_descend: '주소명 내림차순',
}
export interface NestedMapObj {
    rawData: Data[]
    children?: Map<string, NestedMapObj>
    populations?: Record<string, number>
}
export type NestedMap = Map<string, NestedMapObj>
