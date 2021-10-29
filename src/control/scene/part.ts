import { ResImage } from "@/utils/load";
import { Pos, Size } from "@/utils/types";


type PartOpiton = {
    img: ResImage
}

export class Part {

    img: ResImage
    
    size: Size = { width: 0, height: 0 }

    origin: Pos = { top: 0, left: 0 }
    current: Pos = { top: 0, left: 0 }

    constructor(option: PartOpiton) {
        this.img = option.img
    }
    
}