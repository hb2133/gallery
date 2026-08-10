function CreateUuidFromRandomValues(
    CryptoProvider: Crypto,
)
{
    const Bytes = new Uint8Array(16);
    CryptoProvider.getRandomValues(Bytes);
    Bytes[6] = (Bytes[6] & 0x0f) | 0x40;
    Bytes[8] = (Bytes[8] & 0x3f) | 0x80;
    const Hex = Array.from(
        Bytes,
        (Byte) => Byte.toString(16).padStart(2, '0'),
    );

    return [
        Hex.slice(0, 4).join(''),
        Hex.slice(4, 6).join(''),
        Hex.slice(6, 8).join(''),
        Hex.slice(8, 10).join(''),
        Hex.slice(10, 16).join(''),
    ].join('-');
}

export function CreateUniqueId()
{
    const CryptoProvider = globalThis.crypto;

    if(
        CryptoProvider !== undefined
        && typeof CryptoProvider.randomUUID === 'function'
    )
    {
        return CryptoProvider.randomUUID();
    }

    if(
        CryptoProvider !== undefined
        && typeof CryptoProvider.getRandomValues === 'function'
    )
    {
        return CreateUuidFromRandomValues(CryptoProvider);
    }

    return [
        Date.now().toString(36),
        Math.random().toString(36).slice(2),
        Math.random().toString(36).slice(2),
    ].join('-');
}
