'use client';

import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Compartment, EditorState, Text } from '@codemirror/state';
import {
  Decoration,
  MatchDecorator,
  ViewPlugin,
  keymap,
} from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { EditorView, basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';
import { CgSpinner } from 'react-icons/cg';

const fieldDecoration = Decoration.mark({ class: 'field-token' });

const fieldDecorator = new MatchDecorator({
  regexp: /(?<!"|')\{:.+?\}(?!"|')/g,
  decoration: m => fieldDecoration,
});

export const fieldViewPlugin = ViewPlugin.define(
  view => ({
    decorations: fieldDecorator.createDeco(view),
    update(u) {
      this.decorations = fieldDecorator.updateDeco(u, this.decorations);
    },
  }),
  {
    decorations: v => v.decorations,
  }
);

const listDecoration = Decoration.mark({ class: 'list-value-token' });

const listDecorator = new MatchDecorator({
  regexp: /\[:.+\]/g,
  decoration: m => listDecoration,
});

export const listViewPlugin = ViewPlugin.define(
  view => ({
    decorations: listDecorator.createDeco(view),
    update(u) {
      this.decorations = listDecorator.updateDeco(u, this.decorations);
    },
  }),
  {
    decorations: v => v.decorations,
  }
);

const highlightStyle = HighlightStyle.define([
  {
    tag: t.comment,
    color: '#6272a4',
  },
  {
    tag: [t.string, t.special(t.brace)],
    color: '#f1fa8c',
  },
  {
    tag: [t.number, t.self, t.bool, t.null],
    color: '#bd93f9',
  },
  {
    tag: [t.keyword, t.operator],
    color: '#ff79c6',
  },
  {
    tag: [t.definitionKeyword, t.typeName],
    color: '#8be9fd',
  },
  {
    tag: t.definition(t.typeName),
    color: '#f8f8f2',
  },
  {
    tag: [
      t.className,
      t.definition(t.propertyName),
      t.function(t.variableName),
      t.attributeName,
    ],
    color: '#50fa7b',
  },
]);

export default function Editor({
  docState = [''],
  setDocState,
  readonly = false,
  className,
}: {
  docState?: string[];
  setDocState?: (state: string[]) => void;
  readonly?: boolean;
  className?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current === null) {
      return;
    }

    const theme = EditorView.theme(
      {
        '&': {
          backgroundColor: '#24272d',
          color: '#d0d9e4',
          height: '100%',
        },
        '.cm-content': {
          caretColor: '#f8f8f0',
        },
        '.cm-content, .cm-gutter': { height: '100%' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-cursor, .cm-dropCursor': {
          borderLeftColor: '#f8f8f0',
        },
        '&.cm-focused': {
          outline: 'none',
        },
        '&.cm-focused .cm-selectionBackground .cm-selectionBackground, .cm-content ::selection':
          {
            backgroundColor: '#2f333a',
          },
        '.cm-activeLine': {
          backgroundColor: 'transparent',
        },
        '.cm-gutters': {
          border: 'none',
          backgroundColor: '#24272d',
          color: 'd0d9e4',
        },
        '.cm-gutterElement>span': {
          visibility: readonly ? 'hidden' : '',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'transparent',
        },
        '.field-token, .field-token .ͼu': {
          color: '#f08008',
        },
        '.list-value-token': {
          fontWeight: 'bold',
        },
      },
      { dark: true }
    );

    const tabSize = new Compartment();
    const lineWrapping = new Compartment();

    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      javascript(),
      fieldViewPlugin,
      listViewPlugin,
      syntaxHighlighting(highlightStyle),
      tabSize.of(EditorState.tabSize.of(2)),
      EditorState.readOnly.of(readonly),
      theme,
    ];

    if (setDocState) {
      extensions.push(
        EditorView.updateListener.of(v => {
          setDocState(v.state.doc.toJSON());
        })
      );
    }

    const editorState = EditorState.create({
      doc: Text.of(docState),
      extensions: extensions,
    });

    editorRef.current.innerHTML = '';

    const view = new EditorView({
      state: editorState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${className} flex flex-col flex-grow`} ref={editorRef}>
      <div className="flex items-center justify-center p-2 text-sm gap-2">
        <CgSpinner className="animate-spin w-5 h-5" />
        {`Loading${docState ? ' gist' : ''}...`}
      </div>
    </div>
  );
}
