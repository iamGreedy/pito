// Derived : Union
import { pito, plugin } from "./pito.js"

export type ParsePitoUnionObj<Key extends string, Items> =
    Items extends [[infer K, infer V], ...infer Left]
    ? (
        K extends string | number
        ? V extends pito.Obj<infer InnerV>
        ? pito.Obj<InnerV & { [_ in Key]: pito.Lit<K> }>
        : never
        : never
    ) | ParsePitoUnionObj<Key, Left>
    : never

export type UnionObjOption = {}
export type UnionObjSchema<Key extends string> = { discriminator: { propertyName: Key }, oneOf: pito[], $unionKey: Key, $unionMap: Map<number | string, pito.Obj<Record<string, pito>>> }
export type PitoUnionObjBuilder<Key extends string, Cases extends [...[string | number, pito.Obj<Record<string, pito>>][]]> = {
    rawKey: Key
    rawCases: Cases
    case<NewCase extends string | number, NewObj extends pito.Obj<Record<string, pito>>>(ncase: NewCase, obj: NewObj)
        : PitoUnionObjBuilder<Key, [...Cases, [NewCase, NewObj]]>
    end(): PitoUnionObj<Key, ParsePitoUnionObj<Key, Cases>>
}
export type PitoUnionObj<Key extends string, Unions extends pito> = pito<pito.Raw<Unions>, pito.Type<Unions>, UnionObjSchema<Key>, UnionObjOption>
export const PitoUnionObj = <Key extends string>(key: Key): PitoUnionObjBuilder<Key, []> => {
    return {
        rawKey: key,
        rawCases: [],
        case(ncase, obj) {
            // @ts-expect-error
            this.rawCases.push([ncase, obj])
            return this as any
        },
        // @ts-expect-error
        end() {
            const modItemsMap = new Map<number | string, pito.Obj<Record<string, pito>>>()
            // @ts-expect-error
            for (const [k, v] of this.rawCases) {
                const props: Record<string, pito> = {}
                // @ts-expect-error
                for (const k in v.properties) {
                    // @ts-expect-error
                    props[k] = v.properties[k]
                }
                props[key] = pito.Lit(k)
                modItemsMap.set(k, pito.Obj(props))
            }
            return {
                discriminator: { propertyName: key },
                oneOf: Array.from(modItemsMap.values()),
                $unionKey: key,
                $unionMap: modItemsMap,
                $wrap(raw) {
                    // @ts-expect-error
                    return modItemsMap.get(raw[key]).$wrap(raw)
                },
                $unwrap(raw) {
                    // @ts-expect-error
                    return modItemsMap.get(raw[key]).$unwrap(raw)
                },
                $strict() {
                    return {
                        discriminator: { propertyName: key },
                        oneOf: this.oneOf.map((v) => v.$strict())
                    }
                },
                $bypass() {
                    return this.oneOf.findIndex((v) => !v.$bypass()) === -1
                },
            }
        },
    }
}