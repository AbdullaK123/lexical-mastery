/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { 
    $getSelection, 
    $isRangeSelection, 
    $isTextNode, 
    $createTextNode, 
    KEY_DOWN_COMMAND,
    type RangeSelection,
    type TextNode
} from "lexical";
import { useEffect } from "react";
import { DateNode, type DateString, $createDateNode } from "../nodes/DateNode";

// ============================================================================
// TYPES
// ============================================================================

type SelectionInfo = {
    node: TextNode;
    text: string;
    offset: number;
    isValid: boolean;
};

type DateMatch = {
    date: DateString;
    start: number;
    end: number;
    found: boolean;
};

// ============================================================================
// SELECTION HELPERS
// ============================================================================

/**
 * Extracts text node, content, and cursor position from current selection
 * Returns isValid: false if selection is invalid or not in a text node
 */
function getSelectionInfo(selection: RangeSelection): SelectionInfo {
    if (!$isRangeSelection(selection)) {
        return { node: null as any, text: "", offset: 0, isValid: false };
    }
    
    const node = selection.anchor.getNode();
    if (!$isTextNode(node)) {
        return { node: null as any, text: "", offset: 0, isValid: false };
    }
    
    return {
        node,
        text: node.getTextContent(),
        offset: selection.anchor.offset,
        isValid: true
    };
}

/**
 * Positions cursor at the end of the given node
 */
function setCursorAfterNode(node: any): void {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
        selection.anchor.set(node.getKey(), node.getTextContent().length, 'text');
        selection.focus.set(node.getKey(), node.getTextContent().length, 'text');
    }
}

// ============================================================================
// DATE PATTERN DETECTION (FIXED)
// ============================================================================

/**
 * Searches for "/@datestring" pattern before cursor position
 * Returns found: false if no pattern is detected
 */
function findDatePattern(text: string, offset: number): DateMatch {
    // Only look at text before cursor
    const textBeforeCursor = text.substring(0, offset);
    
    // Look for pattern: /@ followed by date string (no spaces allowed in date)
    const match = textBeforeCursor.match(/@(\S+)/);
    
    if (!match) {
        return { date: "", start: 0, end: 0, found: false };
    }
    
    // Find where the match starts in the text
    const start = textBeforeCursor.lastIndexOf(match[0]);
    
    return {
        date: match[1] as DateString,
        start,
        end: start + match[0].length,
        found: true
    };
}

// ============================================================================
// NODE MANIPULATION (FIXED)
// ============================================================================

/**
 * Replaces "/@datestring" text with actual date node
 * Also handles any remaining text and cursor positioning
 */
function insertDateNode(textNode: TextNode, dateInfo: DateMatch, originalText: string): void {
    const { date, start, end } = dateInfo;
    
    // Split original text around the date pattern
    const before = originalText.substring(0, start);
    const after = originalText.substring(end);
    
    // Step 1: Replace current text with "before" part
    textNode.setTextContent(before);
    
    // Step 2: Insert the date node after current text
    const dateNode = $createDateNode(date);
    textNode.insertAfter(dateNode);
    
    // Step 3: Handle remaining text after date (if any)
    let lastInsertedNode: TextNode | DateNode = dateNode;
    
    if (after.trim()) {
        const afterNode = $createTextNode(after);
        dateNode.insertAfter(afterNode);
        lastInsertedNode = afterNode;
    }
    
    // Step 4: Add the space that triggered this plugin
    const spaceNode = $createTextNode(" ");
    lastInsertedNode.insertAfter(spaceNode);
    
    // Step 5: Position cursor after the space
    setCursorAfterNode(spaceNode);

}

// ============================================================================
// MAIN PLUGIN
// ============================================================================

export default function InsertDatePlugin() {
    const [editor] = useLexicalComposerContext();
    
    useEffect(() => {
        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event: KeyboardEvent) => {
                // Only trigger on space key
                if (event.key !== ";") return false;
                
                editor.update(() => {
                    // Get current selection and validate it
                    const selection = $getSelection();
                    if (!selection || !$isRangeSelection(selection)) {
                        return;
                    }

                    const selectionInfo = getSelectionInfo(selection);
                    if (!selectionInfo.isValid) {
                        return;
                    }
                    
                    // Extract what we need to work with
                    const { node, text, offset } = selectionInfo;
                    
                    // Look for date pattern before cursor
                    const dateMatch = findDatePattern(text, offset);
                    if (!dateMatch.found) {
                        return;
                    }
                    
                    
                    // Pattern found! Prevent space from being added normally
                    event.preventDefault();
                    
                    // Replace the pattern with date node
                    insertDateNode(node, dateMatch, text);
                });
                
                return false;
            },
            0
        );
    }, [editor]);

    return null;
}