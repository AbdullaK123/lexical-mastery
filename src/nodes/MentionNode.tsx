import { DecoratorNode, type NodeKey, type LexicalNode, type SerializedLexicalNode } from "lexical";
import { type JSX } from "react";

export type SerializedMentionNode = {
    type: "mention",
    version: 1,
    text: string;
} & SerializedLexicalNode;

export class MentionNode extends DecoratorNode<JSX.Element> {
    __text: string;

    static getType(): string {
        return "mention"
    }

    constructor(text: string, key?: NodeKey) {
        super(key);
        this.__text = text;
    }

    static clone(node: MentionNode): MentionNode {
        return new MentionNode(node.__text, node.__key)
    }

    createDOM(): HTMLElement {
        const span = document.createElement('span');
        span.className = 'mention';
        return span;
    }

    updateDOM(): false {
        return false;
    }

    exportJSON(): SerializedMentionNode {
        return {
            type: "mention",
            version: 1,
            text: this.__text,
        }
    }

    static importJSON(serializedNode: SerializedMentionNode): MentionNode {
        const { text } = serializedNode;
        return new MentionNode(text)
    }

    getTextContent(): string {
        return `@${this.__text}`;
    }

    decorate(): JSX.Element {
        return (
            <span className="mention">
                @{this.__text}
            </span>
        );
    }

    isInline(): boolean {
        return true;
    }
}

export function $createMentionNode(text: string): MentionNode {
    return new MentionNode(text)
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
    return node instanceof MentionNode
}