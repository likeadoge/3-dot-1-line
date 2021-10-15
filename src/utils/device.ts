class Device {
    mode: 'pc' | 'mobile'
    width: number
    height: number

    constructor(){
        const { width, height } = document.body.getClientRects()[0]
        const mode = (height > width && width > 320) ? 'mobile' : 'pc'

        this.width = width
        this.height = height
        this.mode = mode
    }

    vibrate(){
        return window.navigator.vibrate(200)
    }
}

export const device = new Device()