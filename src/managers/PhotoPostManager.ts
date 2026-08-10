import { GetSupabaseBrowserClient } from '@/core/infra/supabase/SupabaseBrowserClient';
import { CreateUniqueId } from '@/core/identity/UniqueId';
import {
    NormalizePhotoPageDirectionSequence,
    type PhotoPageDirection,
} from '@/core/navigation/PhotoPageDirection';
import {
    NormalizePhotoCardTextLayers,
    SetPhotoPostPassword,
    type PhotoCardCustomization,
    type PhotoCardTextLayer,
} from '@/managers/PhotoCardCustomizationManager';
import type {
    GalleryDetailViewMode,
} from '@/panels/base/GalleryBasePanel/controller/GalleryBasePanelTypes';
import type {
    GalleryImageLayoutItem,
    GalleryIndexItem,
} from '@/panels/base/GalleryIndexBasePanel/controller/GalleryIndexBasePanelTypes';

const MaximumPhotoSize = 10 * 1024 * 1024;
const AllowedPhotoTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);

export interface CreatePhotoPostInput
{
    Category: string | null;
    EnabledViewModes: GalleryDetailViewMode[];
    IsPrivate: boolean;
    PageNumberColor: string;
    PageNumberOpacity: number;
    Password?: string;
    TextLayers?: PhotoCardTextLayer[];
    Title?: string;
}

export interface CreatedPhotoPost
{
    Customization: PhotoCardCustomization;
    Item: GalleryIndexItem;
}

export interface PhotoPostContentImage
{
    ForwardDirection: PhotoPageDirection | null;
    Source: string | File;
    X: number;
    Y: number;
}

export interface PhotoPostCopyData
{
    Category: string | null;
    ContentImages: PhotoPostContentImage[];
    EnabledViewModes: GalleryDetailViewMode[];
    IsPrivate: boolean;
    PageNumberColor: string;
    PageNumberOpacity: number;
    TextLayers: PhotoCardTextLayer[];
    ThumbnailSource: string | File | null;
}

function NormalizeEnabledViewModes(
    Value: unknown,
): GalleryDetailViewMode[]
{
    if(Array.isArray(Value))
    {
        const ViewModes: GalleryDetailViewMode[] = [];

        if(Value.includes('book'))
        {
            ViewModes.push('book');
        }

        if(Value.includes('scroll'))
        {
            ViewModes.push('scroll');
        }

        return ViewModes.length === 0 ? ['book'] : ViewModes;
    }

    if(IsRecord(Value))
    {
        const DefaultViewMode =
            Value.default_view_mode === 'scroll'
                ? 'scroll'
                : 'book';
        const IsBookEnabled =
            typeof Value.is_book_view_enabled === 'boolean'
                ? Value.is_book_view_enabled
                : DefaultViewMode === 'book';
        const IsScrollEnabled =
            typeof Value.is_scroll_view_enabled === 'boolean'
                ? Value.is_scroll_view_enabled
                : DefaultViewMode === 'scroll';
        const ViewModes: GalleryDetailViewMode[] = [];

        if(IsBookEnabled)
        {
            ViewModes.push('book');
        }

        if(IsScrollEnabled)
        {
            ViewModes.push('scroll');
        }

        return ViewModes.length === 0 ? ['book'] : ViewModes;
    }

    return ['book'];
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

function NormalizeImagePaths(Value: unknown): string[]
{
    if(Array.isArray(Value) === false)
    {
        return [];
    }

    return Value.flatMap((Candidate) =>
        {
            if(
                typeof Candidate === 'string'
                && (
                    Candidate.startsWith('https://')
                    || Candidate.startsWith('/')
                )
                && Candidate.length <= 1200
            )
            {
                return [Candidate];
            }

            return [];
        });
}

function NormalizeImageLayout(
    Value: unknown,
    ImagePaths: string[],
): GalleryImageLayoutItem[]
{
    const Candidates =
        Array.isArray(Value) ? Value : [];
    const ForwardDirections =
        NormalizePhotoPageDirectionSequence(
            ImagePaths.map((ImagePath, ImageIndex) =>
            {
                const Candidate = Candidates[ImageIndex];

                return (
                    IsRecord(Candidate)
                    && Candidate.image_path === ImagePath
                )
                    ? Candidate.forward_direction as
                        PhotoPageDirection | null | undefined
                    : undefined;
            }),
        );

    return ImagePaths.map((ImagePath, ImageIndex) =>
        ({
            ForwardDirection:
                ForwardDirections[ImageIndex],
            ImagePath,
            X: ImageIndex % 5,
            Y: Math.floor(ImageIndex / 5),
        }),
    );
}

function NormalizePhotoPost(
    Value: unknown,
): GalleryIndexItem | null
{
    if(IsRecord(Value) === false)
    {
        return null;
    }

    const Id =
        typeof Value.id === 'string'
            ? Value.id.slice(0, 100)
            : '';
    const Title =
        typeof Value.title === 'string'
            ? Value.title.trim().slice(0, 120)
            : '';
    const ImagePaths =
        NormalizeImagePaths(Value.image_paths);
    const IsPasswordProtected =
        Value.is_password_protected === true;
    const ImageLayout =
        NormalizeImageLayout(
            Value.image_layout,
            ImagePaths,
        );
    const CoverImagePath =
        typeof Value.cover_image_path === 'string'
        && (
            Value.cover_image_path.startsWith('https://')
            || Value.cover_image_path.startsWith('/')
        )
            ? Value.cover_image_path
            : ImagePaths[0] ?? '';
    const Category =
        typeof Value.category === 'string'
        && Value.category.trim() !== ''
            ? Value.category.trim().slice(0, 20)
            : '';
    const CreatedAt =
        typeof Value.created_at === 'string'
            ? new Date(Value.created_at)
            : new Date();
    const Year =
        Number.isNaN(CreatedAt.getTime())
            ? String(new Date().getFullYear())
            : String(CreatedAt.getFullYear());
    const EnabledViewModes =
        NormalizeEnabledViewModes(Value);
    const DefaultViewMode =
        EnabledViewModes.includes('book')
            ? 'book'
            : 'scroll';

    if(
        Id === ''
        || (
            ImagePaths.length === 0
            && IsPasswordProtected === false
        )
        || CoverImagePath === ''
    )
    {
        return null;
    }

    return {
        Id,
        Title,
        Category: Category || 'Uncategorized',
        Date: Year,
        Description:
            typeof Value.description === 'string'
                ? Value.description.slice(0, 1000)
                : '',
        ImagePaths,
        ImageLayout,
        CoverImagePath,
        Alt: Title || '사진 게시글',
        DetailCategory: Category,
        TitlePosition: 'bottom-left',
        DefaultViewMode,
        EnabledViewModes,
        ScrollDirection: 'horizontal',
        SortOrder:
            typeof Value.sort_order === 'number'
            && Number.isFinite(Value.sort_order)
                ? Value.sort_order
                : 0,
        IsPasswordProtected,
    };
}

export function NormalizePhotoPosts(
    Value: unknown,
): GalleryIndexItem[]
{
    const Rows = Array.isArray(Value) ? Value : [];

    return Rows.flatMap((Candidate) =>
    {
        const Item = NormalizePhotoPost(Candidate);

        return Item === null ? [] : [Item];
    });
}

export async function LoadPhotoPosts():
    Promise<GalleryIndexItem[]>
{
    const Supabase = GetSupabaseBrowserClient();
    const { data, error } =
        await Supabase.rpc('load_photo_posts');

    if(error)
    {
        throw error;
    }

    return NormalizePhotoPosts(data);
}

export async function UnlockPhotoPost(
    PostId: string,
    Password: string,
): Promise<GalleryIndexItem>
{
    const { data, error } =
        await GetSupabaseBrowserClient()
            .rpc('unlock_photo_post', {
                candidate_password: Password,
                target_post_id: PostId,
            })
            .maybeSingle();

    if(error)
    {
        throw error;
    }

    const Item = NormalizePhotoPost(data);

    if(Item === null)
    {
        throw new Error('invalid_photo_password');
    }

    return Item;
}

function ValidateContentImageLayout(
    ContentImages: PhotoPostContentImage[],
)
{
    if(ContentImages.length === 0)
    {
        throw new Error('invalid_photo_count');
    }

    const NormalizedDirections =
        NormalizePhotoPageDirectionSequence(
            ContentImages.map(
                (ContentImage) =>
                    ContentImage.ForwardDirection,
            ),
        );

    ContentImages.forEach((ContentImage, ImageIndex) =>
    {
        const X = Math.round(ContentImage.X);
        const Y = Math.round(ContentImage.Y);

        if(
            X !== ImageIndex % 5
            || Y !== Math.floor(ImageIndex / 5)
            || ContentImage.ForwardDirection
            !== NormalizedDirections[ImageIndex]
        )
        {
            throw new Error('invalid_photo_layout');
        }
    });
}

function ValidatePhotoFiles(Files: File[])
{
    if(Files.length === 0)
    {
        throw new Error('invalid_photo_count');
    }

    if(
        Files.some(
            (File) =>
                AllowedPhotoTypes.has(File.type) === false
                || File.size > MaximumPhotoSize,
        )
    )
    {
        throw new Error('invalid_photo_file');
    }
}

async function UploadPhotoPostImages(
    PostId: string,
    Files: File[],
    FolderName: 'content' | 'thumbnail',
): Promise<string[]>
{
    ValidatePhotoFiles(Files);
    const Supabase = GetSupabaseBrowserClient();

    return Promise.all(
        Files.map(async (File, Index) =>
        {
            const Extension =
                File.name
                    .split('.')
                    .pop()
                    ?.toLowerCase()
                ?? 'webp';
            const StoragePath =
                `${PostId}/${FolderName}/${String(Index + 1).padStart(2, '0')}-${CreateUniqueId()}.${Extension}`;
            const { error } = await Supabase.storage
                .from('photo-post-images')
                .upload(StoragePath, File, {
                    cacheControl: '31536000',
                    contentType: File.type,
                    upsert: false,
                });

            if(error)
            {
                throw error;
            }

            return Supabase.storage
                .from('photo-post-images')
                .getPublicUrl(StoragePath)
                .data.publicUrl;
        }),
    );
}

async function ResolveContentImages(
    PostId: string,
    ContentImages: PhotoPostContentImage[],
)
{
    ValidateContentImageLayout(ContentImages);
    const Files = ContentImages.flatMap(
        (ContentImage) =>
            ContentImage.Source instanceof File
                ? [ContentImage.Source]
                : [],
    );

    if(Files.length > 0)
    {
        ValidatePhotoFiles(Files);
    }

    return Promise.all(
        ContentImages.map(async (ContentImage) =>
        {
            let ImagePath: string;

            if(typeof ContentImage.Source === 'string')
            {
                ImagePath =
                    ContentImage.Source.trim().slice(0, 1200);

                if(
                    ImagePath.startsWith('https://') === false
                    && ImagePath.startsWith('/') === false
                )
                {
                    throw new Error('invalid_photo_path');
                }
            }
            else
            {
                const UploadedPaths =
                    await UploadPhotoPostImages(
                        PostId,
                        [ContentImage.Source],
                        'content',
                    );
                ImagePath = UploadedPaths[0];
            }

            return {
                ForwardDirection:
                    ContentImage.ForwardDirection,
                ImagePath,
                X: Math.round(ContentImage.X),
                Y: Math.round(ContentImage.Y),
            };
        }),
    );
}

export async function CreatePhotoPost(
    Input: CreatePhotoPostInput,
    ContentImages: PhotoPostContentImage[],
    ThumbnailSource: string | File | null,
): Promise<CreatedPhotoPost>
{
    const Password =
        typeof Input.Password === 'string'
            ? Input.Password.trim()
            : '';

    if(
        Password !== ''
        && (Password.length < 4 || Password.length > 72)
    )
    {
        throw new Error('invalid_photo_password');
    }

    const EnabledViewModes =
        NormalizeEnabledViewModes(Input.EnabledViewModes);
    const DefaultViewMode =
        EnabledViewModes.includes('book')
            ? 'book'
            : 'scroll';
    const LegacyTitle =
        typeof Input.Title === 'string'
            ? Input.Title.trim().slice(0, 120)
            : '';
    const TextLayers =
        NormalizePhotoCardTextLayers(
            Input.TextLayers ?? (
                LegacyTitle === ''
                    ? []
                    : [{
                        Id: CreateUniqueId(),
                        Text: LegacyTitle,
                        FontFamily: 'Arial, sans-serif',
                        FontSize: 34,
                        FontWeight: 400,
                        Color: '#ffffff',
                        X: 5,
                        Y: 88,
                    }]
            ),
        );
    const Title =
        TextLayers.find(
            (Layer) => Layer.Text.trim() !== '',
        )?.Text.trim().slice(0, 120) ?? '';
    const Category =
        typeof Input.Category === 'string'
        && Input.Category.trim() !== ''
            ? Input.Category.trim().slice(0, 20)
            : null;

    ValidateContentImageLayout(ContentImages);
    if(ThumbnailSource instanceof File)
    {
        ValidatePhotoFiles([ThumbnailSource]);
    }

    const PostId = `photo-${CreateUniqueId()}`;
    const ImageLayout =
        await ResolveContentImages(
            PostId,
            ContentImages,
        );
    const ImagePaths =
        ImageLayout.map(
            (LayoutItem) => LayoutItem.ImagePath,
        );
    let CoverImagePath = ImagePaths[0];

    if(ThumbnailSource instanceof File)
    {
        const ThumbnailPaths =
            await UploadPhotoPostImages(
                PostId,
                [ThumbnailSource],
                'thumbnail',
            );
        CoverImagePath = ThumbnailPaths[0] ?? ImagePaths[0];
    }
    else if(typeof ThumbnailSource === 'string')
    {
        const ThumbnailPath =
            ThumbnailSource.trim().slice(0, 1200);

        if(
            ThumbnailPath.startsWith('https://') === false
            && ThumbnailPath.startsWith('/') === false
        )
        {
            throw new Error('invalid_thumbnail_path');
        }

        CoverImagePath = ThumbnailPath;
    }
    const Supabase = GetSupabaseBrowserClient();
    const CreatedAt = new Date().toISOString();
    const { data: PostRow, error: PostError } =
        await Supabase
            .from('photo_posts')
            .insert({
                id: PostId,
                title: Title,
                description: '',
                category: Category,
                image_paths: ImagePaths,
                image_layout: ImageLayout.map(
                    (LayoutItem) => ({
                        forward_direction:
                            LayoutItem.ForwardDirection,
                        image_path: LayoutItem.ImagePath,
                        x: LayoutItem.X,
                        y: LayoutItem.Y,
                    }),
                ),
                cover_image_path: CoverImagePath,
                default_view_mode: DefaultViewMode,
                is_book_view_enabled:
                    EnabledViewModes.includes('book'),
                is_scroll_view_enabled:
                    EnabledViewModes.includes('scroll'),
                sort_order: -Date.now(),
                created_at: CreatedAt,
                updated_at: CreatedAt,
            })
            .select(
                'id, title, description, category, image_paths, image_layout, cover_image_path, default_view_mode, is_book_view_enabled, is_scroll_view_enabled, sort_order, created_at',
            )
            .single();

    if(PostError)
    {
        throw PostError;
    }

    const { error: CustomizationError } =
        await Supabase
            .from('photo_card_customizations')
            .insert({
                card_id: PostId,
                category: Category,
                is_deleted: false,
                is_password_protected: false,
                is_private: Input.IsPrivate,
                page_number_color: Input.PageNumberColor,
                page_number_opacity: Input.PageNumberOpacity,
                thumbnail_url: CoverImagePath,
                text_layers: TextLayers,
                updated_at: CreatedAt,
            });

    if(CustomizationError)
    {
        await Supabase
            .from('photo_posts')
            .delete()
            .eq('id', PostId);
        throw CustomizationError;
    }

    const IsPasswordProtected =
        Password === ''
            ? false
            : await SetPhotoPostPassword(PostId, Password);

    const Item = NormalizePhotoPost(PostRow);

    if(Item === null)
    {
        throw new Error('invalid_created_post');
    }

    return {
        Item: {
            ...Item,
            IsPasswordProtected,
        },
        Customization: {
            CardId: PostId,
            Category,
            IsDeleted: false,
            IsPasswordProtected,
            IsPrivate: Input.IsPrivate,
            PageNumberColor: Input.PageNumberColor,
            PageNumberOpacity: Input.PageNumberOpacity,
            ThumbnailUrl: CoverImagePath,
            TextLayers,
        },
    };
}

export async function SavePhotoPostContentImages(
    Item: GalleryIndexItem,
    Category: string | null,
    CoverImagePath: string,
    ContentImages: PhotoPostContentImage[],
    EnabledViewModesInput: GalleryDetailViewMode[],
): Promise<GalleryIndexItem>
{
    const EnabledViewModes =
        NormalizeEnabledViewModes(EnabledViewModesInput);
    const DefaultViewMode =
        EnabledViewModes.includes('book')
            ? 'book'
            : 'scroll';
    const ImageLayout =
        await ResolveContentImages(
            Item.Id,
            ContentImages,
        );
    const ImagePaths =
        ImageLayout.map(
            (LayoutItem) => LayoutItem.ImagePath,
        );
    const Supabase = GetSupabaseBrowserClient();
    const UpdatedAt = new Date().toISOString();
    const { data, error } = await Supabase
        .from('photo_posts')
        .upsert(
            {
                id: Item.Id,
                title: Item.Title,
                description: Item.Description,
                category: Category,
                image_paths: ImagePaths,
                image_layout: ImageLayout.map(
                    (LayoutItem) => ({
                        forward_direction:
                            LayoutItem.ForwardDirection,
                        image_path: LayoutItem.ImagePath,
                        x: LayoutItem.X,
                        y: LayoutItem.Y,
                    }),
                ),
                cover_image_path: CoverImagePath,
                default_view_mode: DefaultViewMode,
                is_book_view_enabled:
                    EnabledViewModes.includes('book'),
                is_scroll_view_enabled:
                    EnabledViewModes.includes('scroll'),
                updated_at: UpdatedAt,
            },
            {
                onConflict: 'id',
            },
        )
        .select(
            'id, title, description, category, image_paths, image_layout, cover_image_path, default_view_mode, is_book_view_enabled, is_scroll_view_enabled, sort_order, created_at',
        )
        .single();

    if(error)
    {
        throw error;
    }

    const SavedItem = NormalizePhotoPost(data);

    if(SavedItem === null)
    {
        throw new Error('invalid_saved_post');
    }

    return SavedItem;
}

export async function SavePhotoPostOrder(
    Items: GalleryIndexItem[],
): Promise<void>
{
    const Supabase = GetSupabaseBrowserClient();
    const Results = await Promise.all(
        Items.map((Item, Index) =>
            Supabase
                .from('photo_posts')
                .update({
                    sort_order: Index,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', Item.Id),
        ),
    );
    const Failed = Results.find(
        (Result) => Result.error !== null,
    );

    if(Failed?.error)
    {
        throw Failed.error;
    }
}
