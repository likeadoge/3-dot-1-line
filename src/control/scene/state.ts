import { Widget } from '../widget'


export class GunStatus {
    type: Map<string, 'number' | 'boolean'> = new Map()

    int: Map<string, number> = new Map()
    boolen: Map<string, boolean> = new Map()
}


export class WidghtTable {
    table: Map<string, Widget> = new Map()
}

