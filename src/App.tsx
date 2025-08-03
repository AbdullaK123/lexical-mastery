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
import { MentionNode } from './nodes/MentionNode';
import InsertMentionPlugin from './plugins/InsertMentionPlugin';
import { DateNode } from './nodes/DateNode';
import InsertDatePlugin from './plugins/InsertDatePlugin';

function App() {

  const initialConfig = {
    namespace: "My Editor",
    theme: {},
    nodes: [ListNode, ListItemNode, MentionNode, DateNode],
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
            <InsertMentionPlugin />
            <InsertDatePlugin />
            <EditorHeader />
            <RichTextPlugin
              contentEditable={<ContentEditable className='editor' />}
              placeholder={<span className='placeholder'>Start typing...</span>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
          </div>
        </LexicalComposer>
    </main>
  )
}

export default App
