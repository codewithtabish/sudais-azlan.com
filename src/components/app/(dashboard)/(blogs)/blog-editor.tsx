"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type BlogEditorProps = {
  value?: any;
  onChange?: (data: any) => void;
  readOnly?: boolean;
};

const BlogEditor: React.FC<BlogEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isInitialized = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // INLINE IMAGES: Dedicated server action (Sharp + WebP + ratio guard)
  const uploadInlineImageToS3 = useCallback(async (file: File) => {
    try {
      const { uploadInlineBlogImage } = await import("@/actions/(images)/upload-inline-image");

      // Convert File → number[] for Server Action
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const fileData = Array.from(uint8Array);

      const result = await uploadInlineBlogImage(fileData, file.type, file.name);

      return {
        success: 1,
        file: {
          url: result.fileUrl,
          name: file.name,
          size: file.size,
        },
      };
    } catch (error: any) {
      console.error("Inline image upload error:", error);
      toast.error(error?.message || "Failed to upload inline image");
      return { success: 0 };
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current || !holderRef.current) return;
    isInitialized.current = true;

    const initEditor = async () => {
      const [
        { default: EditorJS },
        { default: Header },
        { default: Quote },
        { default: Warning },
        { default: Delimiter },
        { default: List },
        { default: NestedList },
        { default: ImageTool },
        { default: LinkTool },
        { default: AttachesTool },
        { default: CodeTool },
        { default: RawTool },
        { default: Marker },
        { default: InlineCode },
        { default: Table },
        { default: Embed },
        { default: Checklist },
        { default: TextVariantTune },
        { default: AlignmentTune },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/quote"),
        import("@editorjs/warning"),
        import("@coolbytes/editorjs-delimiter"),
        import("@editorjs/list"),
        import("@editorjs/nested-list"),
        import("@editorjs/image"),
        import("@editorjs/link"),
        import("@editorjs/attaches"),
        import("@editorjs/code"),
        import("@editorjs/raw"),
        import("@editorjs/marker"),
        import("@editorjs/inline-code"),
        import("@editorjs/table"),
        import("@editorjs/embed"),
        import("@editorjs/checklist"),
        import("@editorjs/text-variant-tune"),
        import("editor-js-alignment-tune"),
      ]);

      editorRef.current = new EditorJS({
        holder: holderRef.current!,
        readOnly,
        autofocus: !readOnly,
        placeholder: "Start writing your amazing blog post here...",
        
        data: value && value.blocks && value.blocks.length > 0 ? value : { blocks: [] },
        
        tools: {
          header: {
            class: Header as any,
            inlineToolbar: true,
            tunes: ["alignmentTune"],
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
              placeholder: "Heading",
            },
          },

          paragraph: {
            inlineToolbar: true,
            tunes: ["alignmentTune", "textVariant"],
          },

          textVariant: {
            class: TextVariantTune,
          },

          alignmentTune: {
            class: AlignmentTune as any,
          },

          quote: {
            class: Quote,
            inlineToolbar: true,
            tunes: ["alignmentTune"],
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Author",
            },
          },

          warning: {
            class: Warning,
            inlineToolbar: true,
            tunes: ["alignmentTune"],
            config: {
              titlePlaceholder: "Title",
              messagePlaceholder: "Message",
            },
          },

          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },

          nestedlist: {
            // @ts-ignore
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },

          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },

          image: {
            class: ImageTool,
            config: {
              uploader: {
                // INLINE IMAGES: Sharp-processed, WebP, ratio-guarded
                uploadByFile: uploadInlineImageToS3,
                uploadByUrl: async (url: string) => {
                  return {
                    success: 1,
                    file: { url },
                  };
                },
              },
              captionPlaceholder: "Image caption",
              features: {
                border: true,
                background: true,
                stretched: true,
                caption: "optional",
              },
            },
          },

          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/fetch-url",
            },
          },

          embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                twitter: true,
                instagram: true,
                codepen: true,
                pinterest: true,
                facebook: true,
                twitch: true,
              },
            },
          },

          attaches: {
            class: AttachesTool,
            config: {
              endpoint: "/api/upload-attachment",
            },
          },

          code: {
            class: CodeTool,
            config: {
              placeholder: "Enter code...",
            },
          },

          raw: {
            class: RawTool,
            // @ts-ignore
            placeholder: "Enter HTML code...",
          },

          table: {
            // @ts-ignore
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },

          delimiter: {
            class: Delimiter,
            config: {
              styleOptions: ["star", "dash", "line"],
              defaultStyle: "star",
              lineWidthOptions: [8, 15, 25, 35, 50, 60, 100],
              defaultLineWidth: 25,
              lineThicknessOptions: [1, 2, 3, 4, 5, 6],
              defaultLineThickness: 2,
            },
          },

          marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+M",
          },

          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+C",
          },
        },

        tunes: ["textVariant", "alignmentTune"],

        onReady: () => {
          setIsReady(true);
        },

        onChange: async () => {
          if (editorRef.current && onChangeRef.current) {
            const saved = await editorRef.current.save();
            onChangeRef.current(saved);
          }
        },

        onError: (error: any) => {
          console.error("Editor error:", error);
          toast.error("Editor encountered an error");
        },
      });
    };

    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
      }
      editorRef.current = null;
      isInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {!isReady && (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      )}
      
      <div
        ref={holderRef}
        className={`min-h-[400px] max-w-6xl ${
          isReady 
            ? "border rounded-xl p-4 bg-background" 
            : "hidden"
        }`}
      />
    </div>
  );
};

export default BlogEditor;