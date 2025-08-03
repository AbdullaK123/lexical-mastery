import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, createCommand, KEY_DOWN_COMMAND, type LexicalCommand } from "lexical";
import { useEffect } from "react";

const INSERT_MENTION_COMMAND: LexicalCommand<string> = createCommand()

export default function InsertMentionPlugin() {
    const [editor] = useLexicalComposerContext()
    useEffect(() => {
        editor.update(() => {
            return editor.registerCommand(
                KEY_DOWN_COMMAND, 
                (e: KeyboardEvent) => {
                    if (e.key !== " ") return false;
                    const selection = $getSelection()
                    if (!$isRangeSelection(selection)) return false;

                    const text = selection.getTextContent()
                    console.log(text)
                    if (text.endsWith('/mention')) {
                        e.preventDefault()
                        editor.dispatchCommand(INSERT_MENTION_COMMAND, "username")
                        return true
                    }
                    return false
                },
                0
            )
        })
    }, [editor])

    return null
}