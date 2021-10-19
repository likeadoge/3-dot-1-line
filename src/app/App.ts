import {device} from '@/utils/device'

export class App {
    target :HTMLDivElement

    constructor(){
        this.target = document.querySelector('#app') as HTMLDivElement
        this.target.dataset.mode = device.mode
    }

    onLog(e:any){
        console.log(e)
    }
}