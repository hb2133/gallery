import assert from 'node:assert/strict';
import {
    DefaultWritingReaderPreferences,
    NormalizeWritingReaderPreferences,
} from './WritingReaderPreferenceManager.ts';

const Migrated = NormalizeWritingReaderPreferences({
    FontSize: 18,
    LineHeight: 1.85,
    ParagraphGap: 24,
    VerticalPadding: 48,
});

assert.equal(Migrated.FontSize, DefaultWritingReaderPreferences.FontSize);
assert.equal(Migrated.LineHeight, DefaultWritingReaderPreferences.LineHeight);
assert.equal(Migrated.ParagraphGap, DefaultWritingReaderPreferences.ParagraphGap);
assert.equal(Migrated.VerticalPadding, DefaultWritingReaderPreferences.VerticalPadding);

const Customized = NormalizeWritingReaderPreferences({
    FontSize: 20,
    LineHeight: 2,
    ParagraphGap: 18,
    VerticalPadding: 56,
});

assert.equal(Customized.FontSize, 20);
assert.equal(Customized.LineHeight, 2);
assert.equal(Customized.ParagraphGap, 18);
assert.equal(Customized.VerticalPadding, 56);
