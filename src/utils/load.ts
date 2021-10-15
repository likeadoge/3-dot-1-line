export abstract class LoadingTask<T = null>{

    static unfinish = 'unfinish!'

    protected val: T | 'unfinish' | 'error' = 'unfinish'

    onload: Promise<T> = new Promise<T>(() => { })

    constructor(onload: Promise<T>) {
        this.onload = onload
    }

    get() {
        if (this.val === 'unfinish')
            throw new Error('Resource is unfinished!')
        else if (this.val === 'error')
            throw new Error('Resource is error!')
        else
            return this.val
    }
}

export class ResImage extends LoadingTask<HTMLImageElement>{

    height: number
    width: number

    constructor(src: string, height: number = 0, width: number = 0) {

        const img = new Image()
        img.src = src

        let resolve = (_: HTMLImageElement) => { }
        let reject = (_: string | Event) => { }

        const onload = new Promise<HTMLImageElement>((res, rej) => {
            resolve = res
            reject = rej
        }).then(img => {
            this.val = img
            this.height = this.height || img.height
            this.width = this.width || img.width

            return img
        })

        super(onload)

        this.height = height
        this.width = width



        img.onload = () => { resolve(img) }
        img.onerror = (e) => { reject(e) }
    }

}