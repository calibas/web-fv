// MarkdownBlogComponent.tsx
import React, { JSXElementConstructor } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";

// Type definitions
interface MarkdownBlogProps {
  content: string;
}

// Custom sanitization schema that allows safe attributes for alignment
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Don't allow className on all elements, only specific ones
    img: [
      ...(defaultSchema.attributes?.img || []),
      "alt",
      "src",
      "title",
      "width",
      "height",
      // Only allow specific classes for images
      ["className", /^blog-image( align-(left|center|right))?$/],
    ],
    // Allow specific classes for blockquotes
    blockquote: [["className", /^blog-blockquote$/]],
    // Allow specific classes for headings
    h1: [["className", /^blog-heading( blog-h1)?$/]],
    h2: [["className", /^blog-heading( blog-h2)?$/]],
    h3: [["className", /^blog-heading( blog-h3)?$/]],
    p: [["className", /^(image-container)?$/]],
  },
};

const MarkdownBlogComponent: React.FC<MarkdownBlogProps> = ({ content }) => {
  // Custom renderers for various elements
  const components: Components = {
    // Custom image component with alignment support
    img: ({ alt, ...props }) => {
      const match = (alt || "").match(/align-(left|center|right)/);
      const alignment = match ? match[1] : "center";
      const altWithoutAlign = (alt || "")
        .replace(/align-(left|center|right)/, "")
        .trim();

      return (
        <img
          {...props}
          alt={altWithoutAlign}
          className={`blog-image align-${alignment}`}
        />
      );
    },

    // Custom blockquote component with styling
    blockquote: ({ children, ...props }) => (
      <blockquote className="blog-blockquote" {...props}>
        {children}
      </blockquote>
    ),

    // Custom heading components with anchor links
    h1: ({ children, ...props }) => (
      <h1 className="blog-heading blog-h1" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="blog-heading blog-h2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="blog-heading blog-h3" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => {
      const childrenArray = React.Children.toArray(children);
      if (
        childrenArray.length === 1 &&
        React.isValidElement(childrenArray[0]) &&
        // Not entirely sure this is the best way checking if it's an image:
        (childrenArray[0].type as JSXElementConstructor<object>).name === "img"
      ) {
        return <>{children}</>;
      }

      return (
        <p className="paragraph">
          {children}
        </p>
      );
    },
  };

  return (
    <div className="markdown-blog-container">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]} // GFM supports tables, strikethrough, etc.
        rehypePlugins={[
          rehypeSlug, // For generating IDs on headings
          [rehypeSanitize, sanitizeSchema], // Apply our custom sanitization
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownBlogComponent;
