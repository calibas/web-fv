// pages/BlogPage.tsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import './css/blog.css';

// Directly lazy-load the MarkdownBlogComponent
const MarkdownBlogComponent = lazy(() => import('../components/MarkdownBlog'));

// Simple loading component
const LoadingFallback: React.FC = () => (
  <div className="markdown-loading">
    <div className="loading-spinner"></div>
    <p>Loading editor...</p>
  </div>
);

// Post type definition
interface Post {
  title: string;
  content: string;
  loading: boolean;
}


const BlogPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post>({
    title: '',
    content: '',
    loading: true
  });

  useEffect(() => {
    const fetchBlogPost = async () => {
    //   if (!id) return; // Handle case where id is undefined
      
      try {
        // Replace with your actual API call
        const response = await fetch(`./blog.md`);
        // const data = await response.json();
        const text = await response.text();
        
        setPost({
          title: "Blog post",
          content: text,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setPost(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBlogPost();
  }, [id]);

  if (post.loading) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="blog-page">
      <h1>{post.title}</h1>
      <Suspense fallback={<LoadingFallback />}>
        <MarkdownBlogComponent content={post.content} />
      </Suspense>
    </div>
  );
};

export default BlogPage;