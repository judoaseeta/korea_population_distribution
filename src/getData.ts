import { csvParse } from 'd3-dsv'
// entity
import { Data } from './type/entity'
export default async function getData() {
    const result = await fetch(
        'https://raw.githubusercontent.com/judoaseeta/csvs/main/korea_population_distribution.csv',
    )
    const data = await result.text()
    const parsed = [...csvParse(data)] as Data[]
    return parsed
}
