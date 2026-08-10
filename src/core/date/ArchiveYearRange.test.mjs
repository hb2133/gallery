import assert from 'node:assert/strict';
import { FormatArchiveIndex } from './ArchiveYearRange.ts';

assert.equal(
    FormatArchiveIndex(['17 May 2026', '2022—2025']),
    'ARCHIVE INDEX · 2022—2026',
);
assert.equal(
    FormatArchiveIndex(['07 Aug 2026']),
    'ARCHIVE INDEX · 2026',
);
assert.equal(FormatArchiveIndex([]), 'ARCHIVE INDEX');
