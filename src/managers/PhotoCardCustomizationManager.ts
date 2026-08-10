import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';
import { CreateUniqueId } from '@/core/identity/UniqueId';

const MaximumTextLayerCount = 20;
const MaximumThumbnailSize = 10 * 1024 * 1024;
const AllowedThumbnailTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);
const AllowedFontWeights = new Set<number>([
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
]);

export type PhotoCardFontWeight =
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;

export interface PhotoCardTextLayer
{
    Id: string;
    Text: string;
    FontFamily: string;
    FontSize: number;
    FontWeight: PhotoCardFontWeight;
    Color: string;
    X: number;
    Y: number;
}

export interface PhotoCardCustomization
{
    CardId: string;
    Category: string | null;
    IsDeleted: boolean;
    IsPasswordProtected: boolean;
    IsPrivate: boolean;
    PageNumberColor: string;
    PageNumberOpacity: number;
    ThumbnailUrl: string;
    TextLayers: PhotoCardTextLayer[];
}

function Clamp(
    Value: number,
    Minimum: number,
    Maximum: number,
)
{
    return Math.min(
        Maximum,
        Math.max(Minimum, Value),
    );
}

function IsRecord(
    Value: unknown,
): Value is Record<string, unknown>
{
    return (
        typeof Value === 'object'
        && Value !== null
        && Array.isArray(Value) === false
    );
}

function NormalizeColor(Value: unknown)
{
    return (
        typeof Value === 'string'
        && /^#[0-9a-f]{6}$/i.test(Value)
    )
        ? Value
        : '#ffffff';
}

export function NormalizePhotoCardTextLayers(
    Value: unknown,
): PhotoCardTextLayer[]
{
    if(Array.isArray(Value) === false)
    {
        return [];
    }

    return Value
        .slice(0, MaximumTextLayerCount)
        .flatMap((Candidate, Index) =>
        {
            if(IsRecord(Candidate) === false)
            {
                return [];
            }

            const Text =
                typeof Candidate.Text === 'string'
                    ? Candidate.Text.slice(0, 120)
                    : '';
            const FontFamily =
                typeof Candidate.FontFamily === 'string'
                    ? Candidate.FontFamily.slice(0, 120)
                    : 'Arial, sans-serif';
            const FontSize =
                typeof Candidate.FontSize === 'number'
                    ? Clamp(Candidate.FontSize, 8, 96)
                    : 32;
            const FontWeight =
                typeof Candidate.FontWeight === 'number'
                && AllowedFontWeights.has(Candidate.FontWeight)
                    ? Candidate.FontWeight as PhotoCardFontWeight
                    : 400;
            const X =
                typeof Candidate.X === 'number'
                    ? Clamp(Candidate.X, 0, 100)
                    : 10;
            const Y =
                typeof Candidate.Y === 'number'
                    ? Clamp(Candidate.Y, 0, 100)
                    : 10;

            return [{
                Id:
                    typeof Candidate.Id === 'string'
                        ? Candidate.Id.slice(0, 80)
                        : `layer-${Index + 1}`,
                Text,
                FontFamily,
                FontSize,
                FontWeight,
                Color: NormalizeColor(Candidate.Color),
                X,
                Y,
            }];
        });
}

function NormalizeThumbnailUrl(
    Value: unknown,
)
{
    if(typeof Value !== 'string')
    {
        return '';
    }

    const Url = Value.trim().slice(0, 1200);

    if(
        Url.startsWith('/')
        || Url.startsWith('https://')
    )
    {
        return Url;
    }

    return '';
}

function NormalizeCustomization(
    Value: unknown,
): PhotoCardCustomization | null
{
    if(IsRecord(Value) === false)
    {
        return null;
    }

    const CardId =
        typeof Value.card_id === 'string'
            ? Value.card_id.slice(0, 100)
            : '';
    const ThumbnailUrl =
        NormalizeThumbnailUrl(Value.thumbnail_url);

    if(
        CardId === ''
        || ThumbnailUrl === ''
    )
    {
        return null;
    }

    return {
        CardId,
        Category:
            typeof Value.category === 'string'
            && Value.category.trim() !== ''
            && Value.category !== '전체'
                ? Value.category.trim().slice(0, 20)
                : null,
        IsDeleted: Value.is_deleted === true,
        IsPasswordProtected:
            Value.is_password_protected === true,
        IsPrivate: Value.is_private === true,
        PageNumberColor: NormalizeColor(
            Value.page_number_color,
        ),
        PageNumberOpacity:
            typeof Value.page_number_opacity === 'number'
                ? Clamp(Value.page_number_opacity, 0, 1)
                : .86,
        ThumbnailUrl,
        TextLayers: NormalizePhotoCardTextLayers(
            Value.text_layers,
        ),
    };
}

export function NormalizePhotoCardCustomizations(
    Value: unknown,
): Record<string, PhotoCardCustomization>
{
    const Rows: unknown[] =
        Array.isArray(Value) ? Value : [];

    return Rows.reduce<
        Record<string, PhotoCardCustomization>
    >((Result, Candidate) =>
    {
        const Customization =
            NormalizeCustomization(Candidate);

        if(Customization !== null)
        {
            Result[Customization.CardId] = Customization;
        }

        return Result;
    }, {});
}

export async function LoadPhotoCardCustomizations(): Promise<
    Record<string, PhotoCardCustomization>
>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } = await Supabase
        .from('photo_card_customizations')
        .select(
            'card_id, category, is_deleted, is_password_protected, is_private, page_number_color, page_number_opacity, thumbnail_url, text_layers',
        );

    if(error)
    {
        throw error;
    }

    return NormalizePhotoCardCustomizations(data);
}

async function UploadPhotoCardThumbnail(
    CardId: string,
    File: File,
)
{
    if(
        AllowedThumbnailTypes.has(File.type) === false
        || File.size > MaximumThumbnailSize
    )
    {
        throw new Error('invalid_thumbnail_file');
    }

    const Extension =
        File.name.split('.').pop()?.toLowerCase() ?? 'webp';
    const Path =
        `${CardId}/${CreateUniqueId()}.${Extension}`;
    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase.storage
        .from('photo-card-thumbnails')
        .upload(Path, File, {
            cacheControl: '31536000',
            upsert: false,
        });

    if(error)
    {
        throw error;
    }

    return Supabase.storage
        .from('photo-card-thumbnails')
        .getPublicUrl(Path)
        .data.publicUrl;
}

export async function SavePhotoCardCustomization(
    Customization: PhotoCardCustomization,
    ThumbnailFile: File | null,
): Promise<PhotoCardCustomization>
{
    const ThumbnailUrl =
        ThumbnailFile === null
            ? NormalizeThumbnailUrl(Customization.ThumbnailUrl)
            : await UploadPhotoCardThumbnail(
                Customization.CardId,
                ThumbnailFile,
            );
    const TextLayers =
        NormalizePhotoCardTextLayers(
            Customization.TextLayers,
        );
    const Category =
        typeof Customization.Category === 'string'
        && Customization.Category.trim() !== ''
        && Customization.Category !== '전체'
            ? Customization.Category.trim().slice(0, 20)
            : null;

    if(ThumbnailUrl === '')
    {
        throw new Error('invalid_thumbnail_url');
    }

    const Supabase = GetSupabaseBrowserClient();
    const { error } = await Supabase
        .from('photo_card_customizations')
        .upsert({
            card_id: Customization.CardId,
            category: Category,
            is_deleted: Customization.IsDeleted,
            is_private: Customization.IsPrivate,
            page_number_color:
                NormalizeColor(Customization.PageNumberColor),
            page_number_opacity:
                Clamp(Customization.PageNumberOpacity, 0, 1),
            thumbnail_url: ThumbnailUrl,
            text_layers: TextLayers,
            updated_at: new Date().toISOString(),
        });

    if(error)
    {
        throw error;
    }

    return {
        CardId: Customization.CardId,
        Category,
        IsDeleted: Customization.IsDeleted,
        IsPasswordProtected:
            Customization.IsPasswordProtected,
        IsPrivate: Customization.IsPrivate,
        PageNumberColor:
            NormalizeColor(Customization.PageNumberColor),
        PageNumberOpacity:
            Clamp(Customization.PageNumberOpacity, 0, 1),
        ThumbnailUrl,
        TextLayers,
    };
}

export async function SetPhotoPostPassword(
    CardId: string,
    Password: string,
): Promise<boolean>
{
    const { data, error } =
        await GetSupabaseBrowserClient().rpc(
            'set_photo_post_password',
            {
                next_password: Password,
                target_post_id: CardId,
            },
        );

    if(error)
    {
        throw error;
    }

    return data === true;
}

export async function LoadPhotoPostPassword(
    CardId: string,
): Promise<string | null>
{
    const { data, error } =
        await GetSupabaseBrowserClient().rpc(
            'get_photo_post_password',
            {
                target_post_id: CardId,
            },
        );

    if(error)
    {
        throw error;
    }

    return typeof data === 'string' ? data : null;
}
