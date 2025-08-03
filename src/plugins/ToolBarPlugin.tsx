import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection,  $isRangeSelection, KEY_DOWN_COMMAND } from "lexical";
import { useEffect, useState } from "react";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { $isListNode, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { $findMatchingParent } from "@lexical/utils";


export default function ToolBarPlugin() {
    const [isBold, setIsBold] = useState<boolean>(false)
    const [isItalic, setIsItalic] = useState<boolean>(false)
    const [insertingList, setInsertingList] = useState<boolean>(false)
    const [editor] = useLexicalComposerContext()

   
    useEffect(() => {
        return editor.registerUpdateListener(() => {
            editor.read(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                    setIsBold(selection.hasFormat("bold"))
                    setIsItalic(selection.hasFormat("italic"))
                    const anchorNode = selection.anchor.getNode()
                    const inList = !!$findMatchingParent(anchorNode, $isListNode)
                    setInsertingList(inList)
                }
            })
        })
    }, [editor])

    useEffect(() => {
        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event: KeyboardEvent) => {
                if (event.ctrlKey && event.key === "B") {
                    event.preventDefault()
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
                    return true
                }
                if (event.ctrlKey && event.key === "I") {
                    event.preventDefault()
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
                    return true
                }
                return false
            },
            0
        )
    }, [editor])

    return (
        <div className="toolbar">
            <button
                className={isItalic ? "active": undefined}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
            >
                I
            </button>
            <button
                className={isBold ? "active": undefined}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            >
                B
            </button>
            <button
                className={insertingList ? "active": undefined}
                onClick={() => {
                    setInsertingList(prev => {
                        const next = !prev 
                        editor.dispatchCommand(
                            next ? INSERT_UNORDERED_LIST_COMMAND : REMOVE_LIST_COMMAND,
                            undefined
                        );
                        return next
                    })
                }}
            >
                ••
            </button>
        </div>
    )
}