export class LoadTask<T = null>{

    static unfinish = 'unfinish!'

    val: T | 'unfinish' = 'unfinish'

    onload: Promise<T> = new Promise<T>(() => { })

    get() {
        if (this.val === 'unfinish')
            throw new Error('Resource is unfinished!')
        else
            return this.val
    }
}

export class Resource{

}