import React from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence } from 'framer-motion'
// entity
import { TotalKeyByYear } from './type/entity'
// hooks
import { useNodeToggled } from './hooks'
// state
import { populationYear } from './state'
// usecase
import { numberWithCommas } from './usecase'
// props
import { PopulationNodeProps } from './type/view'
// component
import TreeLine from './treeLine'
import Violin from './Violin'
import NodeChildren from './NodeChildren'
import LineChart from './LineChart'
// styles
import classnames from 'classnames/bind'
import styles from './populationNode.module.scss'
const cx = classnames.bind(styles)
function PopulationNode({ address, nestedMap, depth, notLastItem, parentAddress, year }: PopulationNodeProps) {
    const populationKey: TotalKeyByYear = `${year}_total`
    const population = nestedMap?.populations ? nestedMap?.populations[populationKey] : 0
    const nextDepth = depth + 1
    const compositionKey = parentAddress ? `${parentAddress}/${address}` : `${address}`
    const { isNodeToggled, onToggleNode } = useNodeToggled(compositionKey)
    const isEnd = !nestedMap?.children
    if (population === 0) {
        return null
    }
    return (
        <>
            <li
                className={cx('populationNodeWrapper', {
                    bgSet: true,
                    child: depth > 1,
                    last: !notLastItem,
                })}
                data-depth={depth}
            >
                <div className={cx('populationNode')}>
                    <div className={cx('populationItem')}>
                        <TreeLine
                            compositeAddress={compositionKey}
                            className={cx('svg', {
                                bgSet: !isEnd,
                                child: depth > 1,
                            })}
                            depth={depth}
                            expanded={isNodeToggled}
                            notLastItem={notLastItem}
                        />

                        <a
                            className={cx('address', {
                                clickable: !isEnd,
                            })}
                            onClick={(e) => {
                                if (!isEnd) {
                                    onToggleNode()
                                }
                            }}
                        >
                            {address}
                        </a>
                    </div>
                    <div className={cx('populationItem', 'justify-between')}>
                        <div className="flex justify-end w-full">
                            <h4 className="text-ssm">{numberWithCommas(population)} 명</h4>
                        </div>
                        {nestedMap?.populations && <LineChart year={year} populations={nestedMap.populations} />}
                    </div>
                    {nestedMap?.populations && <Violin year={year} populations={nestedMap.populations} />}
                    <div className={cx('populationItem')}>
                        <h5 className="text-ssm">
                            {' '}
                            {nestedMap?.children &&
                                [...nestedMap.children.values()].filter(
                                    (child) => child.populations && child.populations[populationKey],
                                ).length}
                        </h5>
                    </div>
                </div>
            </li>
            <NodeChildren
                isNodeToggled={isNodeToggled}
                nestedMap={nestedMap?.children}
                nextDepth={nextDepth}
                parentAddress={compositionKey}
                year={year}
            />
        </>
    )
}
export default React.memo(PopulationNode)
