import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';
import { GetSupabaseStorageObjectPath } from '@/core/storage/SupabaseStorageUrl';

export async function DeleteStoragePublicUrls(
    BucketName: string,
    PublicUrls: readonly string[],
): Promise<void>
{
    const Supabase = GetSupabaseBrowserClient();
    const Bucket = Supabase.storage.from(BucketName);
    const BucketPublicUrl = Bucket.getPublicUrl('').data.publicUrl;
    const Paths = [...new Set(
        PublicUrls.flatMap((PublicUrl) =>
        {
            const Path = GetSupabaseStorageObjectPath(
                PublicUrl,
                BucketPublicUrl,
            );
            return Path === null ? [] : [Path];
        }),
    )];

    if(Paths.length === 0)
    {
        return;
    }

    const { error } = await Bucket.remove(Paths);

    if(error)
    {
        // ponytail: failed cleanup is harmless; add a retry queue if orphaned files become measurable.
        console.error(`Failed to clean ${BucketName} storage assets.`, error);
    }
}
