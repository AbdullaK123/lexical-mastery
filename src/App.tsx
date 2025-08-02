import './App.css'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
// import SelectionLoggerPlugin from './plugins/SelectionLoggerPlugin';
import WordCountPlugin from './plugins/WordCountPlugin';

function App() {

  const initialConfig = {
    namespace: "My Editor",
    theme: {},
    onError: (error: Error) => {
      throw error;
    }
  }

  return (
    <main>
      <h1>Lexical Editor Mastery</h1>
        <LexicalComposer initialConfig={initialConfig}>
          <div className='editor-container'>
            <WordCountPlugin />
            <RichTextPlugin
              contentEditable={<ContentEditable className='editor' />}
              placeholder={<span className='placeholder'>Start typing...</span>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            {/* <SelectionLoggerPlugin /> */}
          </div>
        </LexicalComposer>
    </main>
  )
}

export default App
