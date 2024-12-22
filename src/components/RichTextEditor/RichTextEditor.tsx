import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { ControllerRenderProps, FieldError } from 'react-hook-form';
import './RichTextEditor.scss';

interface Props {
  field?: ControllerRenderProps;
  error?: FieldError;
}

const RichTextEditor = (props: Props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    props.field?.onChange(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  useEffect(() => {
    if (!editorState.getCurrentContent().hasText() && props.field?.value) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(props.field.value).contentBlocks
          )
        )
      );
    }
  }, [props.field?.value]);

  return (
    <div className="rte-wrapper">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="rte-editor-wrapper"
        toolbarClassName="rte-toolbar"
        editorClassName="rte-editor"
      />
      {props.error?.message && (
        <span className={'error-message'}>{props.error.message}</span>
      )}
    </div>
  );
};

export default RichTextEditor;
