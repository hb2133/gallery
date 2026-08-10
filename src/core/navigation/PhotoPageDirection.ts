export type PhotoPageDirection =
    | 'left'
    | 'right'
    | 'up'
    | 'down';

export const PhotoPageDirections:
    readonly PhotoPageDirection[] = [
        'left',
        'right',
        'up',
        'down',
    ];

const DefaultDirectionOrder:
    readonly PhotoPageDirection[] = [
        'right',
        'down',
        'left',
        'up',
    ];

export function IsPhotoPageDirection(
    Value: unknown,
): Value is PhotoPageDirection
{
    return PhotoPageDirections.some(
        (Direction) => Direction === Value,
    );
}

export function GetOppositePhotoPageDirection(
    Direction: PhotoPageDirection,
): PhotoPageDirection
{
    if(Direction === 'left')
    {
        return 'right';
    }

    if(Direction === 'right')
    {
        return 'left';
    }

    if(Direction === 'up')
    {
        return 'down';
    }

    return 'up';
}

export function NormalizePhotoPageDirectionSequence(
    Directions: Array<
        PhotoPageDirection | null | undefined
    >,
): Array<PhotoPageDirection | null>
{
    let PreviousForwardDirection:
        PhotoPageDirection | null = null;

    return Directions.map((Direction, PageIndex) =>
    {
        if(PageIndex === Directions.length - 1)
        {
            return null;
        }

        const BackDirection =
            PreviousForwardDirection === null
                ? null
                : GetOppositePhotoPageDirection(
                    PreviousForwardDirection,
                );
        const NextDirection =
            IsPhotoPageDirection(Direction)
            && Direction !== BackDirection
                ? Direction
                : DefaultDirectionOrder.find(
                    (Candidate) =>
                        Candidate !== BackDirection,
                ) ?? 'right';

        PreviousForwardDirection = NextDirection;

        return NextDirection;
    });
}
