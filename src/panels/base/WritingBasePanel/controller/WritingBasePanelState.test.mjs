import assert from 'node:assert/strict';
import {
    GetWritingPageTransitionDirection,
    IsWritingContentsPageVisible,
    ShouldPromptForWritingPassword,
} from './WritingBasePanelState.ts';

assert.equal(GetWritingPageTransitionDirection(0, 1), 'right');
assert.equal(GetWritingPageTransitionDirection(1, 2), 'down');
assert.equal(GetWritingPageTransitionDirection(2, 3), 'left');
assert.equal(GetWritingPageTransitionDirection(3, 4), 'up');
assert.equal(GetWritingPageTransitionDirection(4, 3), 'down');
assert.equal(
    GetWritingPageTransitionDirection(0, 1, ['up']),
    'up',
);
assert.equal(
    GetWritingPageTransitionDirection(1, 0, ['left']),
    'right',
);
assert.equal(IsWritingContentsPageVisible(0, 0, true), true);
assert.equal(IsWritingContentsPageVisible(1, 0, true), true);
assert.equal(IsWritingContentsPageVisible(2, 0, true), false);
assert.equal(IsWritingContentsPageVisible(1, 0, false), false);
assert.equal(ShouldPromptForWritingPassword(true, false, false), true);
assert.equal(ShouldPromptForWritingPassword(true, false, true), false);
assert.equal(ShouldPromptForWritingPassword(true, true, false), false);
