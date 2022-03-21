import React from 'react'

import classnames from 'classnames/bind'
import skeletonStyles from './skeleton.module.scss'

const scx = classnames.bind(skeletonStyles)

export default function LoadingHeader(): JSX.Element {
    return (
        <div className="relative w-screen flex flex-row gap-2 justify-center items-center p-2  mb-5 ">
            <form className="w-1/3 h-full relative flex items-center mb-0">
                <div className={scx('skeleton', ' outline-0 border h-ih border-black w-full p-1 text-sm')} />
            </form>
        </div>
    )
}
