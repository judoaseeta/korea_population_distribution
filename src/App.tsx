import React, { Suspense } from 'react'

// component
import Populations from './Populations'
import ErrorBoundary from './ErrorBoundary'
import SearchForm from './SearchForm'
import LoadingBody from './LoadingBody'
import LoadingHeader from './LoadingHeader'
import SortBar from './SortBar'

// styles
import './index.css'

export default function App() {
    return (
        <div className="flex flex-col gap-2 items-center bg-background w-screen h-screen">
            <ErrorBoundary>
                <Suspense fallback={<LoadingHeader />}>
                    <SearchForm />
                </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
                <Suspense fallback={<LoadingBody />}>
                    <Populations />
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}
