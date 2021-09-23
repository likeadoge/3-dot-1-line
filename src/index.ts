import { App } from '@/app/App'

App.main.onLog((msg) => console.log(msg))


// import { Point } from '@/base/Point'
// import { RandomPathView } from '@/view/RandomPathView'

// export class Display {

//     height = 400
//     width = 400
//     canvas = document.createElement('canvas')
//     ctx: CanvasRenderingContext2D

//     constructor() {
//         this.canvas.height = this.height
//         this.canvas.width = this.width

//         const ctx = this.canvas.getContext('2d')
//         if (!ctx)
//             throw new Error('ctx is null !!!')
//         else
//             this.ctx = ctx

//         document.body.appendChild(this.canvas)
//     }

//     dot(point: Point, color: [number, number, number, number] = [255, 255, 255, 0.3], size: number = 2) {
//         const ctx = this.ctx

//         ctx.beginPath();
//         ctx.arc(point.x, point.y, size, 0, Math.PI * 2, true);
//         ctx.fillStyle = `rgba(${color.join(',')})`
//         ctx.fill();
//     }

// }

// export class Game {

//     static main = new Game()

//     screen = new Display()
//     view = new RandomPathView()

//     constructor() {
//         this.start()
//     }

//     draw() {
//         this.view.path.forEach(({ control, point }) => {
//             this.screen.dot(control.trans(x => (x + 1) * 200), [255, 0, 0, 1])
//             this.screen.dot(point.trans(x => (x + 1) * 200), [0, 255, 0, 1])
//         })
//     }

//     async start() {
//         while (true) {
//             this.draw()
//             for (const p of this.view.createNextPath()) {
//                 this.screen.dot(p.trans(x => (x + 1) * 200), [0, 0, 0, 0.3])
//                 await this.wait()
//             }

//         }
//     }

//     wait(timeout = 1000 / 60) {
//         return new Promise(res =>
//             setTimeout(() => { res(null) }, timeout)
//         )
//     }
// }