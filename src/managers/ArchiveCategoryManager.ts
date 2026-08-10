import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';

export type ArchiveCategoryBoard =
    | 'media'
    | 'photo'
    | 'writing';

export async function RenameArchiveCategory(
    Board: ArchiveCategoryBoard,
    CurrentName: string,
    NextName: string,
): Promise<void>
{
    const { error } = await GetSupabaseBrowserClient().rpc(
        'rename_archive_category',
        {
            board_name: Board,
            current_name: CurrentName,
            next_name: NextName,
        },
    );

    if(error)
    {
        throw error;
    }
}
