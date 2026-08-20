export function GetSupabaseStorageObjectPath(
    PublicUrl: string,
    BucketPublicUrl: string,
): string | null
{
    try
    {
        const Candidate = new URL(PublicUrl);
        const Bucket = new URL(BucketPublicUrl);
        const Prefix = `${Bucket.pathname.replace(/\/$/, '')}/`;

        if(
            Candidate.origin !== Bucket.origin
            || Candidate.pathname.startsWith(Prefix) === false
        )
        {
            return null;
        }

        const Path = decodeURIComponent(
            Candidate.pathname.slice(Prefix.length),
        );

        return Path !== ''
            && Path.split('/').every(
                (Part) => Part !== '' && Part !== '.' && Part !== '..',
            )
            ? Path
            : null;
    }
    catch
    {
        return null;
    }
}
