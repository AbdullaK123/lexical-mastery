import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getSelection } from "lexical";

export default function SelectionLoggerPlugin() {
    const [editor] = useLexicalComposerContext()
    useEffect(() => {
        return editor.registerUpdateListener(({editorState }) => {
            editor.read(() => {
                console.log("Current editor state: ", editorState)
                const selection = $getSelection()
                console.log("Selection changed -> ", selection)
            })
        });
    }, [editor])

    return null
}