import { Context2D } from "./canvas2d"
import { ResImageBitmap } from "./load"
import { Pos, Size } from "./types"

export class CanvasPicture {

    bitmap: ImageBitmap
    size: Size
    o: Pos

    constructor(img: ResImageBitmap) {
        this.o = img.o
        this.bitmap = img.get()
        this.size = { ...img.size }
    }

    draw(context: Context2D) {
        context.image({
            image: this.bitmap,
            pos: { left: 0, top: 0 },
            size: this.size
        })
    }
}