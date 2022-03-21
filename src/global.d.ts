declare module '*.scss' {
    const styles: {
        [key: string]: string
    }
    export default styles
}
declare module '*.css' {
    const styles: {
        [key: string]: string
    }
    export default styles
}

declare module '*.png' {
    const value: any
    export = value
}
declare module '*.jpg' {
    const value: any
    export = value
}
declare module '*.svg' {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
    const src: string
    export default src
}
