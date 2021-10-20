class Device {
    mode: 'pc' | 'mobile'
    width: number
    height: number
    renderTime: number = 0

    constructor() {
        const { width, height } = document.body.getClientRects()[0]
        const mode = (height > width && width > 320) ? 'mobile' : 'pc'
        this.mode = mode;

        [this.width, this.height] = this.mode === 'mobile'
            ? [width, height]
            : [360, 640]

        this.updateRenderTime()
    }

    vibrate() {
        return window.navigator.vibrate(200)
    }

    updateRenderTime(){
        this.renderTime = this.getCurTime();
    }

    getCurTime(){
        return new Date().getTime() 
    }

}

export const device = new Device()