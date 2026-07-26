"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Loader2,
  ImageIcon,
  CheckCircle2,
  FileText,
  Globe,
  Info,
  Upload,
  Eye,
  Star,
} from "lucide-react";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { blogSchema, BlogSchemaType, slugify } from "@/schemas/blog-schema";
import { createBlogAction } from "@/actions/(blogs)/create-blog";
import { uploadWatermarkedImage } from "@/actions/(images)/upload-w-m-banner-image";
import { uploadWatermarkedOgImage } from "@/actions/(images)/upload-w-m-og-image";
import BlogEditor from "./blog-editor";
import { useRouter } from "next/navigation";

// ============================================
// IMAGE UPLOAD FIELD COMPONENT
// ============================================
type ImageUploadFieldProps = {
  label: string;
  icon: React.ElementType;
  preview: string | null;
  url: string;
  isUploading: boolean;
  fieldName: string;
  showError: boolean;
  errorMessage?: string;
  description: string;
  dimensions: string;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

const ImageUploadField = React.memo(
  ({
    label,
    icon: Icon,
    preview,
    url,
    isUploading,
    fieldName,
    showError,
    errorMessage,
    description,
    dimensions,
    onFileSelect,
    onRemove,
  }: ImageUploadFieldProps) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {label}
        </label>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
          <Info className="h-3 w-3" />
          <span>{dimensions}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>

      {!preview ? (
        <label
          htmlFor={`${fieldName}-input`}
          className={`flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition
          ${
            isUploading
              ? "border-primary bg-primary/5 cursor-wait"
              : showError
                ? "border-destructive bg-destructive/5 hover:border-destructive/80"
                : "border-border bg-muted/30 hover:border-primary hover:bg-primary/5"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <div className="absolute inset-0 h-10 w-10 rounded-full bg-primary/10 animate-ping" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-primary">Uploading to S3...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please don&apos;t close this tab
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium text-foreground text-sm">
                Click to upload {label.toLowerCase()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, WEBP — Max 5MB
              </p>
            </>
          )}
          <input
            id={`${fieldName}-input`}
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      ) : (
        <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-border group shadow-sm">
          <Image
            src={preview}
            alt={label}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Uploaded
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3 rounded-full bg-destructive/90 backdrop-blur-sm p-2 text-destructive-foreground shadow-lg transition-all hover:bg-destructive hover:scale-110 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[11px] text-white/90 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 truncate font-mono">
              {url}
            </p>
          </div>
        </div>
      )}

      {showError && errorMessage && (
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      )}
    </div>
  )
);

ImageUploadField.displayName = "ImageUploadField";

// ============================================
// FEATURED TOGGLE
// ============================================
const FeaturedToggle = React.memo(
  ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${value ? "bg-amber-500/20" : "bg-muted"}`}
        >
          <Star
            className={`h-5 w-5 ${
              value
                ? "text-amber-500 fill-amber-500"
                : "text-muted-foreground"
            }`}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Featured Blog</p>
          <p className="text-xs text-muted-foreground">
            {value
              ? "This blog will appear in the featured section"
              : "This blog will appear in the regular listing"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          value ? "bg-amber-500" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
);

FeaturedToggle.displayName = "FeaturedToggle";

// ============================================
// MAIN FORM
// ============================================
export const BlogFormComp = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const [ogPreview, setOgPreview] = useState<string | null>(null);
  const [ogImageUrl, setOgImageUrl] = useState<string>("");
  const [isOgUploading, setIsOgUploading] = useState(false);

  const [editorContent, setEditorContent] = useState<any>({ blocks: [] });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    trigger,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<BlogSchemaType>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      coverImage: "",
      ogImage: "",
      isFeatured: false,
      content: { blocks: [] },
    },
    // Validation only on submit attempt. After that, re-validate on every change.
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const isFeatured = useWatch({ control, name: "isFeatured" });
  const watchedTitle = useWatch({ control, name: "title" });
  const watchedSlug = useWatch({ control, name: "slug" });
  const watchedCover = useWatch({ control, name: "coverImage" });
  const watchedOg = useWatch({ control, name: "ogImage" });

  // Helper: should we show error for this field?
  const showFieldError = useCallback(
    (fieldName: keyof BlogSchemaType) => {
      return (
        !!errors[fieldName] &&
        (!!touchedFields[fieldName] || attemptedSubmit)
      );
    },
    [errors, touchedFields, attemptedSubmit]
  );

  // Editor change handler – NEVER force validation on the initial empty emit
  const handleEditorChange = useCallback(
    (data: any) => {
      setEditorContent(data);
      const hasBlocks = data?.blocks && data.blocks.length > 0;

      setValue("content", data, {
        shouldValidate: attemptedSubmit, // only validate after user has tried to submit
        shouldDirty: true,
        shouldTouch: true,
      });

      // After a submit attempt, keep the visual error in sync
      if (attemptedSubmit) {
        trigger("content");
      }
    },
    [setValue, attemptedSubmit, trigger]
  );

  // REMOVED the previous useEffect that called setValue(..., { shouldValidate: true }).
  // It was redundant with handleEditorChange and could re-trigger validation.

  const handleGenerateSlug = useCallback(() => {
    const title = getValues("title");
    if (title?.trim()) {
      setValue("slug", slugify(title), {
        shouldValidate: attemptedSubmit || !!touchedFields.slug,
        shouldTouch: true,
      });
    }
  }, [getValues, setValue, attemptedSubmit, touchedFields.slug]);

  // BANNER UPLOAD
  const handleCoverUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Cover image must be an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Cover image must be less than 5MB");
        return;
      }

      const localPreview = URL.createObjectURL(file);
      setCoverPreview(localPreview);
      setIsCoverUploading(true);
      toast.loading("Uploading banner...", { id: "cover-upload" });

      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadWatermarkedImage(formData);

        URL.revokeObjectURL(localPreview);
        setCoverPreview(result.fileUrl);
        setCoverImageUrl(result.fileUrl);
        setValue("coverImage", result.fileUrl, {
          shouldValidate: attemptedSubmit || !!touchedFields.coverImage,
          shouldTouch: true,
        });

        toast.success("Banner uploaded!", { id: "cover-upload" });
      } catch (error: any) {
        console.error("Banner upload error:", error);
        URL.revokeObjectURL(localPreview);
        setCoverPreview(null);
        setCoverImageUrl("");
        setValue("coverImage", "", {
          shouldValidate: attemptedSubmit || !!touchedFields.coverImage,
          shouldTouch: true,
        });
        toast.error(error?.message || "Failed to upload banner", {
          id: "cover-upload",
        });
      } finally {
        setIsCoverUploading(false);
      }
    },
    [setValue, attemptedSubmit, touchedFields.coverImage]
  );

  // OG UPLOAD
  const handleOgUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("OG image must be an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("OG image must be less than 10MB");
        return;
      }

      const localPreview = URL.createObjectURL(file);
      setOgPreview(localPreview);
      setIsOgUploading(true);
      toast.loading("Uploading OG image...", { id: "og-upload" });

      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadWatermarkedOgImage(formData);

        URL.revokeObjectURL(localPreview);
        setOgPreview(result.fileUrl);
        setOgImageUrl(result.fileUrl);
        setValue("ogImage", result.fileUrl, {
          shouldValidate: attemptedSubmit || !!touchedFields.ogImage,
          shouldTouch: true,
        });

        toast.success("OG image uploaded!", { id: "og-upload" });
      } catch (error: any) {
        console.error("OG upload error:", error);
        URL.revokeObjectURL(localPreview);
        setOgPreview(null);
        setOgImageUrl("");
        setValue("ogImage", "", {
          shouldValidate: attemptedSubmit || !!touchedFields.ogImage,
          shouldTouch: true,
        });
        toast.error(error?.message || "Failed to upload OG image", {
          id: "og-upload",
        });
      } finally {
        setIsOgUploading(false);
      }
    },
    [setValue, attemptedSubmit, touchedFields.ogImage]
  );

  const removeCoverImage = useCallback(() => {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    setCoverImageUrl("");
    setValue("coverImage", "", {
      shouldValidate: attemptedSubmit || !!touchedFields.coverImage,
      shouldTouch: true,
    });
    toast.info("Banner removed");
  }, [coverPreview, setValue, attemptedSubmit, touchedFields.coverImage]);

  const removeOgImage = useCallback(() => {
    if (ogPreview?.startsWith("blob:")) URL.revokeObjectURL(ogPreview);
    setOgPreview(null);
    setOgImageUrl("");
    setValue("ogImage", "", {
      shouldValidate: attemptedSubmit || !!touchedFields.ogImage,
      shouldTouch: true,
    });
    toast.info("OG image removed");
  }, [ogPreview, setValue, attemptedSubmit, touchedFields.ogImage]);

  // SUBMIT
  const onSubmit = useCallback(
    async (data: BlogSchemaType) => {
      const payload = {
        title: data.title,
        slug: data.slug,
        content: editorContent,
        ogImage: ogImageUrl,
        bannerImage: coverImageUrl,
        featured: data.isFeatured,
      };

      const result = await createBlogAction(payload);

      if (result.success) {
        toast.success("Blog created successfully!");
        reset();
        setEditorContent({ blocks: [] });
        setCoverPreview(null);
        setCoverImageUrl("");
        setOgPreview(null);
        setOgImageUrl("");
        setAttemptedSubmit(false);
        // Redirect after a short delay so the toast is visible
        setTimeout(() => {
          router.push("/dashboard/blogs");
          router.refresh();
        }, 1200);
      } else {
        toast.error(result.error || "Failed to create blog");
      }
    },
    [editorContent, coverImageUrl, ogImageUrl, reset]
  );

  // Handle invalid submit attempt
  const onInvalid = useCallback(() => {
    setAttemptedSubmit(true);
    toast.error("Please fill in all required fields correctly");
  }, []);

  // PREVIEW
  const handlePreview = useCallback(() => {
    if (!editorContent || !editorContent.blocks?.length) {
      toast.error("No content to preview. Add some content first.");
      return;
    }
    sessionStorage.setItem(
      "blog_preview_content",
      JSON.stringify({ content: editorContent })
    );
    window.open("/dashboard/blogs/preview", "_blank");
  }, [editorContent]);

  const hasContent = editorContent?.blocks?.length > 0;

  // Manual readiness check – does NOT trigger Zod / does not cause the UnhandledRejection.
  // This gives the exact UX you asked for: button disabled until everything is filled.
  const isFormReady =
    !!watchedTitle?.trim() &&
    !!watchedSlug?.trim() &&
    !!watchedCover &&
    !!watchedOg &&
    hasContent &&
    !isSubmitting &&
    !isCoverUploading &&
    !isOgUploading;

  return (
    <>
      <Toaster position="top-right" richColors />

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-8 max-w-5xl mx-auto p-6 md:p-8 rounded-2xl bg-card border shadow-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-center space-y-2 flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Create a Blog
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details below to publish your new blog post
            </p>
          </div>

          <div className="shrink-0 pt-2">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            className={`w-full px-4 py-3 rounded-xl text-sm bg-background border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
              ${
                showFieldError("title")
                  ? "border-destructive focus:border-destructive"
                  : "border-input hover:border-primary/50 focus:border-primary"
              }`}
            placeholder="My Awesome Blog Post"
          />
          {showFieldError("title") && (
            <p className="text-sm font-medium text-destructive">
              {errors.title?.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            Slug <span className="text-destructive">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...register("slug")}
              className={`flex-1 px-4 py-3 rounded-xl text-sm bg-background border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
                ${
                  showFieldError("slug")
                    ? "border-destructive focus:border-destructive"
                    : "border-input hover:border-primary/50 focus:border-primary"
                }`}
              placeholder="my-awesome-post"
            />
            <button
              type="button"
              onClick={handleGenerateSlug}
              className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 active:scale-95 transition-all duration-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
              </svg>
              Auto
            </button>
          </div>
          {showFieldError("slug") && (
            <p className="text-sm font-medium text-destructive">
              {errors.slug?.message}
            </p>
          )}
        </div>

        {/* Featured Toggle */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            Visibility
          </label>
          <FeaturedToggle
            value={isFeatured}
            onChange={(val) =>
              setValue("isFeatured", val, {
                shouldValidate: attemptedSubmit,
              })
            }
          />
        </div>

        {/* Cover Image */}
        <ImageUploadField
          label="Cover Image"
          icon={ImageIcon}
          preview={coverPreview}
          url={coverImageUrl}
          isUploading={isCoverUploading}
          fieldName="coverImage"
          showError={showFieldError("coverImage")}
          errorMessage={errors.coverImage?.message}
          description="The main banner displayed at the top of your blog post. Must be 16:9 aspect ratio (e.g. 1920×1080)."
          dimensions="16:9 — 1920 × 1080"
          onFileSelect={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverUpload(file);
          }}
          onRemove={removeCoverImage}
        />

        {/* OG Image */}
        <ImageUploadField
          label="OG Image"
          icon={Globe}
          preview={ogPreview}
          url={ogImageUrl}
          isUploading={isOgUploading}
          fieldName="ogImage"
          showError={showFieldError("ogImage")}
          errorMessage={errors.ogImage?.message}
          description="Social media preview image. Must be 1.91:1 aspect ratio (e.g. 1200×630)."
          dimensions="1.91:1 — 1200 × 630"
          onFileSelect={(e) => {
            const file = e.target.files?.[0];
            if (file) handleOgUpload(file);
          }}
          onRemove={removeOgImage}
        />

        {/* Blog Content */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Blog Content <span className="text-destructive">*</span>
          </label>
          <div
            className={`rounded-xl transition-all ${
              showFieldError("content") ? "ring-1 ring-destructive" : ""
            }`}
          >
            <BlogEditor value={editorContent} onChange={handleEditorChange} />
          </div>
          {showFieldError("content") && (
            <p className="text-sm font-medium text-destructive">
              {errors.content?.message || "Blog content is required"}
            </p>
          )}
          {!hasContent && !showFieldError("content") && (
            <p className="text-xs text-muted-foreground">
              Start writing content in the editor above
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={!isFormReady}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Creating...
              </span>
            ) : (
              "Create Blog"
            )}
          </button>

          {!isFormReady && !isSubmitting && (
            <p className="text-xs text-muted-foreground">
              Complete all required fields and uploads to enable submission.
            </p>
          )}
        </div>
      </form>
    </>
  );
};