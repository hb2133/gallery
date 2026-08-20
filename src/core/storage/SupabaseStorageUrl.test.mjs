import assert from 'node:assert/strict';
import { GetSupabaseStorageObjectPath } from './SupabaseStorageUrl.ts';

const BucketUrl =
    'https://sample.supabase.co/storage/v1/object/public/photos';

assert.equal(
    GetSupabaseStorageObjectPath(
        `${BucketUrl}/post/content/image%201.webp?version=2`,
        BucketUrl,
    ),
    'post/content/image 1.webp',
);
assert.equal(
    GetSupabaseStorageObjectPath(
        'https://example.com/storage/v1/object/public/photos/image.webp',
        BucketUrl,
    ),
    null,
);
assert.equal(
    GetSupabaseStorageObjectPath(
        'https://sample.supabase.co/storage/v1/object/public/other/image.webp',
        BucketUrl,
    ),
    null,
);
assert.equal(GetSupabaseStorageObjectPath('/images/local.webp', BucketUrl), null);
