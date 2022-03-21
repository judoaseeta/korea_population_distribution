import React from 'react'
import { RecoilRoot } from 'recoil'
import { render } from 'react-dom'
import App from './App'
const container = document.getElementById('root')

if (container) {
    render(
        <RecoilRoot>
            <App />
        </RecoilRoot>,
        container,
    )
}
