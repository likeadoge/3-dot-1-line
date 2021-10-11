export class Vec3 {
    0: number
    1: number
    2: number

    constructor(v0: number, v1: number, v2: number) {
        this[0] = v0
        this[1] = v1
        this[2] = v2
    }

    unitVec() { return this }
}

export const vec3 = (v0: number, v1: number = v0, v2: number = v1) => new Vec3(v0, v1, v2)

type OpType3 = '+' | '-' | '/' | 'x' | '*'

type Expr3Input = (Vec3 | OpType3 | Expr3Input)[]

export class Expr3 {

    static ['+'] = (a: Vec3, b: Vec3) => vec3(a[0]+b[0],a[1]+b[1],a[2]+b[2])
    static ['-'] = (a: Vec3, b: Vec3) => vec3(a[0]-b[0],a[1]-b[1],a[2]-b[2])
    static ['*'] = (a: Vec3, b: Vec3) => vec3(a[0]*b[0],a[1]*b[1],a[2]*b[2])
    static ['/'] = (a: Vec3, b: Vec3) => vec3(a[0]/b[0],a[1]/b[1],a[2]/b[2])
    
    static ['x'] = (a: Vec3, b: Vec3) => vec3(a[0]+b[0],a[1]+b[1],a[2]+b[2])

    list: (Vec3 | OpType3 | Expr3)[] = []
    constructor(list: Expr3Input) {
        this.list = list.map(v => {
            if (v instanceof Vec3) {
                return v
            } else if (v instanceof Array) {
                return new Expr3(v)
            } else {
                return v
            }
        })
    }

    val(): Vec3 {
        if (!(this.list[0] instanceof Vec3) && !(this.list[0] instanceof Expr3))
            throw new Error('expr error')

        let curent = this.list[0] instanceof Vec3 ? this.list[0] : this.list[0].val()
        let opIndex = 1

        while (this.list[opIndex]) {
            const op = this.list[opIndex]
            const next = this.list[opIndex + 1]

            if (!(next instanceof Vec3) && !(next instanceof Expr3))
                throw new Error('expr error')

            if (typeof op !== 'string')
                throw new Error('expr error')

            curent = Expr3[op](curent, next instanceof Vec3 ? next : next.val())

            opIndex += 2
        }

        return curent
    }
}
export const expr3 = (...list: Expr3Input) => new Expr3(list)

