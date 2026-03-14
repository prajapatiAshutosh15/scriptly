"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import { Button, Space, Tooltip, Divider } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  FontSizeOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  LinkOutlined,
  PictureOutlined,
  LineOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef } from "react";
import TurndownService from "turndown";

// HTML to Markdown converter
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

export default function RichTextEditor({ content, onChange }) {
  const hasLoadedContent = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      // Convert HTML to Markdown on every change
      const html = editor.getHTML();
      const markdown = turndown.turndown(html);
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        style: "outline: none; min-height: 400px; font-size: 17px; line-height: 1.8; padding: 0;",
      },
    },
  });

  // Update editor content when content prop changes (edit mode)
  useEffect(() => {
    if (editor && content && !hasLoadedContent.current) {
      // Convert markdown to basic HTML for the editor
      const html = content
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hlubo])(.+)$/gm, '<p>$1</p>');

      editor.commands.setContent(html || content);
      hasLoadedContent.current = true;
    }
  }, [editor, content]);

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({ icon, title, action, isActive }) => (
    <Tooltip title={title}>
      <Button
        type={isActive ? "primary" : "text"}
        ghost={isActive}
        icon={icon}
        size="small"
        onClick={action}
        style={{ minWidth: 32 }}
      />
    </Tooltip>
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        position: "sticky",
        top: 64,
        zIndex: 40,
        borderBottom: "1px solid var(--border-color)",
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        padding: "6px 0",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <Space size={2} wrap>
            <ToolBtn
              icon={<BoldOutlined />}
              title="Bold (Ctrl+B)"
              action={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            />
            <ToolBtn
              icon={<ItalicOutlined />}
              title="Italic (Ctrl+I)"
              action={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            />
            <ToolBtn
              icon={<StrikethroughOutlined />}
              title="Strikethrough"
              action={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
            />

            <Divider type="vertical" style={{ margin: "0 4px" }} />

            <ToolBtn
              icon={<FontSizeOutlined />}
              title="Heading 2"
              action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
            />
            <Tooltip title="Heading 3">
              <Button
                type={editor.isActive("heading", { level: 3 }) ? "primary" : "text"}
                ghost={editor.isActive("heading", { level: 3 })}
                size="small"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                style={{ minWidth: 32, fontSize: 12, fontWeight: 700 }}
              >
                H3
              </Button>
            </Tooltip>

            <Divider type="vertical" style={{ margin: "0 4px" }} />

            <ToolBtn
              icon={<UnorderedListOutlined />}
              title="Bullet List"
              action={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
            />
            <ToolBtn
              icon={<OrderedListOutlined />}
              title="Numbered List"
              action={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
            />

            <Divider type="vertical" style={{ margin: "0 4px" }} />

            <ToolBtn
              icon={<CodeOutlined />}
              title="Code Block"
              action={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
            />
            <Tooltip title="Blockquote">
              <Button
                type={editor.isActive("blockquote") ? "primary" : "text"}
                ghost={editor.isActive("blockquote")}
                size="small"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                style={{ minWidth: 32, fontSize: 16 }}
              >
                &ldquo;
              </Button>
            </Tooltip>

            <Divider type="vertical" style={{ margin: "0 4px" }} />

            <ToolBtn icon={<LinkOutlined />} title="Add Link" action={addLink} />
            <ToolBtn icon={<PictureOutlined />} title="Add Image" action={addImage} />
            <ToolBtn
              icon={<LineOutlined />}
              title="Horizontal Rule"
              action={() => editor.chain().focus().setHorizontalRule().run()}
            />

            <Divider type="vertical" style={{ margin: "0 4px" }} />

            <ToolBtn
              icon={<UndoOutlined />}
              title="Undo"
              action={() => editor.chain().focus().undo().run()}
            />
            <ToolBtn
              icon={<RedoOutlined />}
              title="Redo"
              action={() => editor.chain().focus().redo().run()}
            />
          </Space>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
