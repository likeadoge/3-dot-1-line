export class Vec3 {
    0: number
    1: number
    2: number

    constructor(v0: number, v1: number, v2: number) {
        this[0] = v0
        this[1] = v1
        this[2] = v2
    }

    //单位向量(向量方向)
    unitVec() {
        return op3['/'](this,vec3(this.length()))
    }
    // 向量长度
    squaredLength() {
        return this[0] ** 2 + this[1] ** 2 + this[2] ** 2
    }
    length() {
        return this.squaredLength() ** (1 / 2)
    }
}

export const vec3 = (v0: number, v1: number = v0, v2: number = v1) => new Vec3(v0, v1, v2)

type OpType3 = '+' | '-' | '/' | 'x' | '*' | '·'

export const op3 = {
    ['+']: (a: Vec3, b: Vec3) => vec3(a[0] + b[0], a[1] + b[1], a[2] + b[2]),
    ['-']: (a: Vec3, b: Vec3) => vec3(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
    ['*']: (a: Vec3, b: Vec3) => vec3(a[0] * b[0], a[1] * b[1], a[2] * b[2]),
    ['/']: (a: Vec3, b: Vec3) => vec3(a[0] / b[0], a[1] / b[1], a[2] / b[2]),

    ['x']: (a: Vec3, b: Vec3) => vec3(
        (a[1] * b[2] - a[2] * b[1]),
        (a[0] * b[2] - a[2] * b[0]) * (-1),
        (a[0] * b[1] - a[1] * b[0])
    ),

    ['·']: (a: Vec3, b: Vec3) => {
        const s = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
        return vec3(s)
    },
}

export const ex3 = (...list: (Vec3 | OpType3)[]) => {
    if (!(list[0] instanceof Vec3))
        throw new Error('expr error')

    let curent = list[0]
    let opIndex = 1

    while (list[opIndex]) {
        const op = list[opIndex]
        const next = list[opIndex + 1]

        if (!(next instanceof Vec3))
            throw new Error('expr error')

        if (typeof op !== 'string')
            throw new Error('expr error')

        curent = op3[op](curent, next)
        opIndex += 2
    }

    return curent
}

export const e3 = Object.assign(ex3, op3)