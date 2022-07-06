import { pito, plugin } from "./pito.js"

// Std-Types : Email
export type EmailOption = {}
export type EmailSchema = { type: 'string', format: 'email' }
export type PitoEmail = pito<string, string, EmailSchema, EmailOption>
export const PitoEmail = (): PitoEmail => {
    return {
        type: 'string',
        format: 'email',
        $wrap(data) {
            return data
        },
        $unwrap(raw) {
            return raw
        },
        $strict() {
            return {
                type: 'string',
                format: 'email',
            }
        },
        $bypass() {
            return true
        },
    }
}

//
Object.defineProperty(plugin, 'Email', { value: PitoEmail, configurable: false, writable: false })
declare module './pito' {
    interface PitoPlugin {
        Email: typeof PitoEmail
    }
    namespace pito {
        type Email = PitoEmail
    }
}