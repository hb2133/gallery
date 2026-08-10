import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
    GetWritingBlockShortcut,
    GetWritingEnterBehavior,
    GetWritingSlashQuery,
    InsertWritingEditorAssets,
    NormalizeWritingSlashSearchText,
} from './WritingBasePanelState.ts';

test('슬래시 뒤의 블록 검색어만 찾는다', () =>
{
    assert.equal(GetWritingSlashQuery('/', 1), '');
    assert.equal(GetWritingSlashQuery('/인용', 3), '인용');
    assert.equal(GetWritingSlashQuery('글 /제목 2', 5), '제목');
    assert.equal(GetWritingSlashQuery('글/인용', 4), null);
    assert.equal(GetWritingSlashQuery('/인용 다음', 6), null);
});

test('슬래시 메뉴 검색은 띄어쓰기를 구분하지 않는다', () =>
{
    assert.equal(
        NormalizeWritingSlashSearchText('제목 1'),
        NormalizeWritingSlashSearchText('제목1'),
    );
    assert.equal(
        NormalizeWritingSlashSearchText('글머리 목록'),
        '글머리목록',
    );
});

test('Notion형 블록 입력 단축어만 찾는다', () =>
{
    assert.equal(
        GetWritingBlockShortcut('---'),
        'insertHorizontalRule',
    );
    assert.equal(
        GetWritingBlockShortcut('-'),
        'insertUnorderedList',
    );
    assert.equal(
        GetWritingBlockShortcut('1.'),
        'insertOrderedList',
    );
    assert.equal(GetWritingBlockShortcut('--'), null);
    assert.equal(GetWritingBlockShortcut('문장 -'), null);
});

test('코드 블록 Enter는 내부 줄바꿈이고 Shift Enter는 블록을 나간다', () =>
{
    assert.deepEqual(
        GetWritingEnterBehavior('PRE', false),
        {
            Command: 'insertLineBreak',
            ShouldExitBlock: false,
        },
    );
    assert.deepEqual(
        GetWritingEnterBehavior('PRE', true),
        {
            Command: 'insertParagraph',
            ShouldExitBlock: true,
        },
    );
    assert.deepEqual(
        GetWritingEnterBehavior(null, false),
        {
            Command: 'insertParagraph',
            ShouldExitBlock: false,
        },
    );
});

test('업로드 HTML을 드롭 표시 위치에 넣고 표시가 없으면 뒤에 붙인다', () =>
{
    const Marker = '<hr data-editor-drop-target="true">';
    const Media = '<figure><img src="image.jpg"></figure>';

    assert.equal(
        InsertWritingEditorAssets(`<p>앞</p>${Marker}<p>뒤</p>`, Media),
        `<p>앞</p>${Media}<p>뒤</p>`,
    );
    assert.equal(
        InsertWritingEditorAssets('<p>앞</p>', Media),
        `<p>앞</p>${Media}`,
    );
});
