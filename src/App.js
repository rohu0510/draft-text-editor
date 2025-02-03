import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./App.css";

const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Load saved content from localStorage on mount
  useEffect(() => {
    if (window.localStorage) {
      const savedContent = localStorage.getItem("editorContent");
      if (savedContent) {
        const contentState = convertFromRaw(JSON.parse(savedContent));
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, []);

  // Check key pressed to handle the text
  const handleBeforeInput = (inputChar, currentEditorState) => {
    if (inputChar !== " ") return "not-handled";

    const selection = currentEditorState.getSelection();
    const content = currentEditorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const currentBlock = content.getBlockForKey(blockKey);
    const textBefore = currentBlock
      .getText()
      .slice(0, selection.getStartOffset());

    let newContent = content;
    let newEditorState = currentEditorState;

    // Function to remove all inline styles from the entire block
    const removeAllInlineStyles = (editorState, blockKey) => {
      const stylesToRemove = ["BOLD", "RED", "UNDERLINE"];
      let contentState = editorState.getCurrentContent();
      const block = contentState.getBlockForKey(blockKey);
      // Create a selection that spans the entire block.
      const blockSelection = editorState.getSelection().merge({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: block.getLength(),
      });

      stylesToRemove.forEach((style) => {
        contentState = Modifier.removeInlineStyle(
          contentState,
          blockSelection,
          style
        );
      });

      return EditorState.push(editorState, contentState, "change-inline-style");
    };

    // For heading (H1)
    if (textBefore === "#") {
      // Remove trigger character and space
      newContent = Modifier.replaceText(
        newContent,
        selection.merge({ anchorOffset: 0, focusOffset: 1 }),
        ""
      );
      newEditorState = EditorState.push(
        currentEditorState,
        newContent,
        "change-block-type"
      );
      newEditorState = removeAllInlineStyles(newEditorState, blockKey);
      newEditorState = RichUtils.toggleBlockType(newEditorState, "header-one");
      setEditorState(newEditorState);
      return "handled";
    }

    // For underline (***)
    if (textBefore === "***") {
      newContent = Modifier.replaceText(
        newContent,
        selection.merge({ anchorOffset: 0, focusOffset: 3 }),
        ""
      );
      newEditorState = EditorState.push(
        currentEditorState,
        newContent,
        "change-inline-style"
      );
      newEditorState = removeAllInlineStyles(newEditorState, blockKey);
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE");
      setEditorState(newEditorState);
      return "handled";
    }

    // For red text (**)
    if (textBefore === "**") {
      newContent = Modifier.replaceText(
        newContent,
        selection.merge({ anchorOffset: 0, focusOffset: 2 }),
        ""
      );
      newEditorState = EditorState.push(
        currentEditorState,
        newContent,
        "change-inline-style"
      );
      newEditorState = removeAllInlineStyles(newEditorState, blockKey);
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "RED");
      setEditorState(newEditorState);
      return "handled";
    }

    // For bold text (*)
    if (textBefore === "*") {
      newContent = Modifier.replaceText(
        newContent,
        selection.merge({ anchorOffset: 0, focusOffset: 1 }),
        ""
      );
      newEditorState = EditorState.push(
        currentEditorState,
        newContent,
        "change-inline-style"
      );
      newEditorState = removeAllInlineStyles(newEditorState, blockKey);
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "BOLD");
      setEditorState(newEditorState);
      return "handled";
    }

    return "not-handled";
  };

  // Ensure that when pressing Enter a new unstyled block is created.
  const handleReturn = (e, currentEditorState) => {
    const contentState = currentEditorState.getCurrentContent();
    const selectionState = currentEditorState.getSelection();
    // Split the current block.
    const newContentState = Modifier.splitBlock(contentState, selectionState);
    // Force the new block to be unstyled.
    const newSelection = newContentState.getSelectionAfter();
    const newContentStateWithUnstyled = Modifier.setBlockType(
      newContentState,
      newSelection,
      "unstyled"
    );
    const newEditorState = EditorState.push(
      currentEditorState,
      newContentStateWithUnstyled,
      "split-block"
    );
    setEditorState(newEditorState);
    return "handled";
  };

  // Regular onChange handler
  const onEditorChange = (newState) => {
    setEditorState(newState);
  };

  // Save current content to localStorage.
  const handleSave = () => {
    if (!window.localStorage) {
      alert("Local storage is not available.");
      return;
    }
    try {
      const contentState = editorState.getCurrentContent();
      localStorage.setItem(
        "editorContent",
        JSON.stringify(convertToRaw(contentState))
      );
      alert("Content saved!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Save failed! Check the console.");
    }
  };

  // Define custom inline styles.
  const customStyleMap = {
    RED: { color: "red" },
    UNDERLINE: { textDecoration: "underline" },
    BOLD: { fontWeight: "bold" },
  };

  return (
    <div className="editor-container">
      <h1 className="editor-title">Demo Text Editor by Rohit</h1>
      <button className="save-button" onClick={handleSave}>
        💾 Save Content
      </button>
      <div className="editor-surface">
        <Editor
          editorState={editorState}
          onChange={onEditorChange}
          handleBeforeInput={handleBeforeInput}
          handleReturn={handleReturn}
          customStyleMap={customStyleMap}
          placeholder="Type text. Use '#' for heading, '*' for bold, '**' for red text, '***' for underline"
        />
      </div>
    </div>
  );
};

export default TextEditor;
