import { Display } from '@/game/Display'
import { View } from './View'


export class StatusBarView extends View {


    constructor(screen: Display) {
        super(screen)

        const option = this.screen

        this.left = 30
        this.right = option.width - 30
        this.updateWidth()

        this.top = 30
        this.bottom = 40
        this.updateHeight()
    }


    draw(len: { focus: number, trigger: number }) {
        this.drawBG()
        this.drawBar(len)
        this.drawRound()
    }


    private drawRound() {
        const { screen } = this
        screen.ctx.lineJoin = 'round'
        screen.ctx.lineWidth = 2;
        screen.ctx.strokeRect(this.left, this.top, this.width, this.height)
    }

    private drawBG() {
        const { screen } = this

        screen.ctx.fillStyle = "rgba(240, 62, 77, 0.2)"
        screen.ctx.fillRect(this.left, this.top, this.width, this.height)
    }

    private drawBar({ focus, trigger }: { focus: number, trigger: number }) {

        const { screen } = this

        screen.ctx.fillStyle = "rgba(240, 62, 77, 0.6)"
        screen.ctx.fillRect(this.left, this.top, this.width * focus, this.height)
        
        screen.ctx.fillStyle = "rgba(240, 62, 77, 1)"
        screen.ctx.fillRect(this.left, this.top, this.width * trigger, this.height)
    }


}

