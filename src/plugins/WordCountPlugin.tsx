import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect, useState } from "react";

function getWordCount(text: string): number {
    return text.match(/\b\w+\b/g)?.length ?? 0
}

export default function WordCountPlugin() {
    const [wordCount, setWordCount] = useState(0)
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        return editor.registerTextContentListener(() => {
            editor.read(() => {
                const content = $getRoot().getTextContent()
                setWordCount(prev => {      
                    const newWordCount = getWordCount(content)
                    return prev === newWordCount ? prev : newWordCount
                })
            })
        })
    }, [editor])

    return (
        <div className="word-counter">
            <span>{`${wordCount} words`}</span>
        </div>
    )
}