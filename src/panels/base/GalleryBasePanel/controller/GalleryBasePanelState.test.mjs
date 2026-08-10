import assert from 'node:assert/strict';
import {
    IsGalleryBoxLayout,
    MoveGalleryBoxLayout,
    NormalizeCategoryBoxLayouts,
    NormalizeDailyMessageRotationSeconds,
} from './GalleryBasePanelState.ts';

assert.equal(IsGalleryBoxLayout([13, 8, 12, 14, 18]), true);
assert.equal(IsGalleryBoxLayout([13, 8, 8, 14, 18]), false);
assert.equal(IsGalleryBoxLayout([13, 8, 12, 14, 26]), false);

const Normalized = NormalizeCategoryBoxLayouts({
    architecture: [8, 12, 13, 14, 18],
});

assert.deepEqual(Normalized.architecture, [13, 8, 12, 14, 18]);
assert.deepEqual(Normalized.portraits, [13, 12, 14, 15, 18]);
assert.deepEqual(
    MoveGalleryBoxLayout([13, 8, 12, 14, 18], 8, 4),
    [13, 4, 12, 14, 18],
);
assert.deepEqual(
    MoveGalleryBoxLayout([13, 8, 12, 14, 18], 13, 4),
    [13, 8, 12, 14, 18],
);
assert.deepEqual(
    MoveGalleryBoxLayout([13, 8, 12, 14, 18], 8, 12),
    [13, 8, 12, 14, 18],
);
assert.equal(NormalizeDailyMessageRotationSeconds(20), 20);
assert.equal(NormalizeDailyMessageRotationSeconds(1), 3);
assert.equal(NormalizeDailyMessageRotationSeconds(9999), 3600);
assert.equal(NormalizeDailyMessageRotationSeconds('20'), 10);
