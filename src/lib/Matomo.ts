const trackerQueue = (): Array<any>[] => (window as any)?._paq || []

interface Matomo {
    isUserOptedOut(): boolean;
    optUserOut(): void;
    forgetUserOptOut(): void;
    trackEvent(
        category: string,
        action: string,
        name?: string,
        value?: string | number
    ): void
}

export async function getMatomo(): Promise<Matomo> {
    return new Promise(function (resolve) {
        trackerQueue().push([function (this: Matomo) {
            return resolve(this)
        }])
    })
}

export async function isOptedOut(): Promise<boolean> {
    const Matomo = await getMatomo()
    return Matomo.isUserOptedOut()
}

export async function optOut(): Promise<void> {
    const Matomo = await getMatomo()
    return Matomo.optUserOut()
}

export async function optIn(): Promise<void> {
    const Matomo = await getMatomo()
    return Matomo.forgetUserOptOut()
}


export const trackInput = async (inputId: string, value?: string | number): Promise<boolean> => {
    const Matomo = await getMatomo()
    Matomo.trackEvent("form", "input", inputId, value?.toString())
    return true // in order to allow using it in && expressions
}
