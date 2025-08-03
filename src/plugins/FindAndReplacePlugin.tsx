import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { $createNodeSelection, $getRoot, $isElementNode, $setSelection, type LexicalNode } from "lexical";
import { useEffect } from "react";


export default function FindAndReplacePlugin() {
    const [editor] = useLexicalComposerContext()
    
    useEffect(() => {

        const styledNodes = new Set();

        return editor.registerUpdateListener(() => {
            editor.update(() => {
                const root = $getRoot()

                const collectChildren = (node: LexicalNode) => {
                    const allNodes = []
                    allNodes.push(node)
                    if ($isElementNode(node)) {
                        node.getChildren().forEach((child) => {
                            const childNodes = collectChildren(child)
                            allNodes.push(...childNodes)
                        })
                    }
                    return allNodes
                }

                const nodes = 
                    collectChildren(root)
                        .map((node) => {
                            return {
                                key: node.getKey(),
                                text: node.getTextContent(),
                                node: node
                            }
                        })
                        .filter((nodeData) => {
                            return nodeData.text.includes("cat") && !styledNodes.has(nodeData.key)
                        })

                // Do the styling directly here, no nested editor.update()
                nodes.forEach((nodeData) => {
                    const selection = $createNodeSelection();
                    selection.add(nodeData.key);
                    $setSelection(selection);
                    $patchStyleText(selection, { "color": "red"})
                    styledNodes.add(nodeData.key)
                })
            })
        })
    }, [editor])
    
    return null
}