import { DecoratorNode,  type LexicalNode, type SerializedLexicalNode } from "lexical";
import { type JSX } from "react";


export type SerializedMentionNode = {
    type: "mention",
    version: 1,
    text: string;
} & SerializedLexicalNode;


export class MentionNode extends DecoratorNode<JSX.Element> {

    private __text: string;

    constructor(__text: string, key?: string) {
        super(key);
        this.__text = __text;
    }

    static getType() {
        return "mention"
    }

    static clone(node: MentionNode) {
        return new MentionNode(node.__text, node.__key)
    }

    exportJSON(): SerializedMentionNode {
        return {
            ...(super.exportJSON() as SerializedLexicalNode),
            type: "mention",
            version: 1,
            text: this.__text
        }
    }

    decorate(): JSX.Element {
      return (
        <span className="mention">
          @{this.__text}
        </span>
      );
    }

    static importJSON(serializedNode: SerializedMentionNode): MentionNode {
        const { text } = serializedNode;
        return new MentionNode(text)
    }
}

export function $createMentionNode(text: string) {
    return new MentionNode(text)
}

export function isMentionNode(node: LexicalNode) {
    return node instanceof MentionNode
}