export function FormatArchiveIndex(
    DateValues: readonly string[],
): string
{
    const Years = DateValues.flatMap((Value) =>
        Array.from(Value.matchAll(/(?:19|20)\d{2}/g), (Match) =>
            Number(Match[0]),
        ),
    );

    if(Years.length === 0)
    {
        return 'ARCHIVE INDEX';
    }

    const OldestYear = Math.min(...Years);
    const LatestYear = Math.max(...Years);

    return OldestYear === LatestYear
        ? `ARCHIVE INDEX · ${OldestYear}`
        : `ARCHIVE INDEX · ${OldestYear}—${LatestYear}`;
}
