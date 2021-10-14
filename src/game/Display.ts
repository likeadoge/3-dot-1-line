import { GameOpiton } from './Game'
export class Display {
    height: number
    width: number
    canvas = document.createElement('canvas')
    cntr: Element
    ctx: CanvasRenderingContext2D

    constructor(option: GameOpiton) {
        this.height = option.height
        this.width = option.width
        this.cntr = option.cntr

        this.canvas.height = this.height
        this.canvas.width = this.width

        this.cntr.appendChild(this.canvas)

        const ctx = this.canvas.getContext('2d')

        if (!ctx)
            throw new Error('ctx is null !!!')
        else
            this.ctx = ctx

    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}


export class GlDisplay extends Display {
    gl: WebGLRenderingContext
    constructor(option: GameOpiton) {
        super(option)
        const ctx = this.canvas.getContext('webgl')

        if (!ctx)
            throw new Error('ctx is null !!!')
        else
            this.gl = ctx
    }

    private vsSource = `
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `

    private fsSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `

    clear(){
        const {gl} = this
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }


    draw(){

    }


    initShaderProgram() {

        function loadShader(gl:any, type:any, source:any) {
            const shader = gl.createShader(type);
          
            // Send the source to the shader object
          
            gl.shaderSource(shader, source);
          
            // Compile the shader program
          
            gl.compileShader(shader);
          
            // See if it compiled successfully
          
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
              alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
              gl.deleteShader(shader);
              return null;
            }
          
            return shader;
          }

        const {gl, vsSource, fsSource} = this

        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
      
        // 创建着色器程序
      
        const shaderProgram = gl.createProgram();

        if(!shaderProgram) throw new Error('')

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
      
        // 创建失败， alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
          return null;
        }
      
        return shaderProgram;
      }
}


