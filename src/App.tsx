import './App.css'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import EditorHeader from './plugins/EditorHeader';
import { ListItemNode, ListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import FindAndReplacePlugin from './plugins/FindAndReplacePlugin';

function App() {

  const initialConfig = {
    namespace: "My Editor",
    theme: {},
    nodes: [ListNode, ListItemNode],
    onError: (error: Error) => {
      throw error;
    }
  }

  return (
    <main>
      <h1>Lexical Editor Mastery</h1>
        <LexicalComposer initialConfig={initialConfig}>
          <div className='editor-container'>
            <ListPlugin />
            <EditorHeader />
            <RichTextPlugin
              contentEditable={<ContentEditable className='editor' />}
              placeholder={<span className='placeholder'>Start typing...</span>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <FindAndReplacePlugin />
          </div>
        </LexicalComposer>
    </main>
  )
}

export default App
