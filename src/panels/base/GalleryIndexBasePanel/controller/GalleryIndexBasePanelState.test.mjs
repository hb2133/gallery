import assert from 'node:assert/strict';
import {
    MoveGalleryIndexItem,
} from './GalleryIndexBasePanelState.ts';

const Items = [
    { Id: 'a' },
    { Id: 'b' },
    { Id: 'c' },
];

assert.deepEqual(
    MoveGalleryIndexItem(Items, 'a', 'c')
        .map((Item) => Item.Id),
    ['b', 'c', 'a'],
);
assert.equal(
    MoveGalleryIndexItem(Items, 'missing', 'a'),
    Items,
);
