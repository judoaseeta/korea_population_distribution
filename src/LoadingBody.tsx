import React from 'react'
import classnames from 'classnames/bind'
import styles from './skeleton.module.scss'
import nodeStyles from './populationNode.module.scss'
const cx = classnames.bind(styles)
const ncx = classnames.bind(nodeStyles)
const mockArray = new Array(18).fill('a').map((d) => d)

export default function LoadingBody(): JSX.Element {
    return (
        <ul className={'flex flex-col w-auto h-auto shadow-2xl border-t border-border'}>
            {mockArray.map((_, i) => (
                <li
                    key={`mockbody_${i}`}
                    className={ncx(
                        'populationNode',
                        'bg-slate-50 h-ih w-[60rem] grid grid-cols-node flex items-center border border-t-0 border-border/40',
                    )}
                >
                    <div className={ncx('populationItem')}>
                        <h4 className={cx('skeleton', 'ml-2 text-ssm w-3/5')}>fffff</h4>
                    </div>
                    <div className={ncx('populationItem')}>
                        <h4 className={cx('skeleton', 'ml-2  text-ssm w-3/5')}>fffff</h4>
                    </div>
                    <div className={ncx('populationItem')}>
                        <h4 className={cx('skeleton', 'ml-2  text-ssm w-3/5')}>fffff</h4>
                    </div>
                    <div className={ncx('populationItem')}>
                        <h4 className={cx('skeleton', 'ml-2  text-ssm w-3/5')}>fffff</h4>
                    </div>
                </li>
            ))}
        </ul>
    )
}
