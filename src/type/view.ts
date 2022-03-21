// entity
import { Data, NestedMapObj, NestedMap, Year } from './entity'
export interface PopulationNodeProps {
    address: string
    depth: number
    parentAddress: string
    nestedMap?: NestedMapObj
    notLastItem: boolean
    year: Year
}
export interface TreeLineProps {
    compositeAddress: string
    depth: number
    className: string
    notLastItem: boolean
    expanded: boolean
}

export interface ViolinProps {
    year: Year
    populations: Record<string, number>
}
export interface SearchFormProps {}

export interface NodeChildrenProps {
    nestedMap?: NestedMap
    nextDepth: number
    parentAddress: string
    isNodeToggled: boolean
    year: Year
}

export interface LineChartProps {
    year: Year
    populations: Record<string, number>
}
