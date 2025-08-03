import ToolBarPlugin from "./ToolBarPlugin";
import WordCountPlugin from "./WordCountPlugin";



export default function EditorHeader() {
    return (
        <div className="editor-header">
            <ToolBarPlugin />
            <WordCountPlugin />
        </div>
    )
}