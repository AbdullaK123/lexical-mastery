import { DecoratorNode, type LexicalNode, type SerializedLexicalNode } from "lexical";
import type { JSX } from "react";

export type DateString = "today" | "yesterday" | "last_week" | "last_month" | "last_year" | ""

export type SerializedDateNode = {
    type: string,
    version: number,
    date: DateString,
    dateString: string
} & SerializedLexicalNode

export class DateNode extends DecoratorNode<JSX.Element> {

    private __date: DateString;

    constructor(time: DateString, key?: string) {
        super(key)
        this.__date = time;
    }

    private getDateString(): string {
        const today = new Date();
        let targetDate: Date;

        switch (this.__date) {
            case "today":
                targetDate = today;
                break;
            case "yesterday":
                targetDate = new Date(today);
                targetDate.setDate(today.getDate() - 1);
                break;
            case "last_week":
                targetDate = new Date(today);
                targetDate.setDate(today.getDate() - 7);
                break;
            case "last_month":
                targetDate = new Date(today);
                targetDate.setMonth(today.getMonth() - 1);
                break;
            case "last_year":
                targetDate = new Date(today);
                targetDate.setFullYear(today.getFullYear() - 1);
                break;
            default:
                // If it's not a keyword, try to parse it as a date
                targetDate = new Date(this.__date);
                // If invalid date, fallback to today
                if (isNaN(targetDate.getTime())) {
                    targetDate = today;
                }
                break;
        }

        // Format options - choose your preferred format
        return this.formatDate(targetDate);
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            'year': 'numeric',
            'month': 'short',
            'day': 'numeric'
        })
    }

    static getType(): string {
        return "date"
    }

    static clone(node: DateNode): DateNode {
        return new DateNode(node.__date, node.__key)
    }

    createDOM(): HTMLElement {
        const span = document.createElement('span')
        span.className = "date"
        return span
    }

    updateDOM(): boolean {
        return false
    }

    decorate(): JSX.Element {
        return (
            <span className="date">
                {this.getDateString()}
            </span>
        )
    }

    exportJSON(): SerializedDateNode {
        return {
            type: "date",
            version: 1,
            date: this.__date,
            dateString: this.getDateString()
        }
    }

    static importJSON(_serializedNode: SerializedLexicalNode): LexicalNode {
        const { date } = _serializedNode as SerializedDateNode
        return new DateNode(date)
    }
}

export function $createDateNode(date: DateString) {
    return new DateNode(date)
}

export function $isDateNode(node: LexicalNode | null | undefined): node is DateNode {
    return node instanceof DateNode
}