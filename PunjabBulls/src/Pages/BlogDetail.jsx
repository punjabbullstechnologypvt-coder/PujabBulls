import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBlogBySlug,
  fetchPublishedBlogs,
} from "../services/publicBlogService";
import BlogRenderer from "../components/BlogRenderer";
import SEO from "../components/SEO";
import NotFound from "./NotFound";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const load = async () => {
      try {
        const [data, related] = await Promise.all([
          fetchBlogBySlug(slug),
          fetchPublishedBlogs({ page: 1, limit: 6 }),
        ]);

        if (!data?.blog) {
          setStatus("not_found");
          return;
        }

        setBlog(data.blog);
        setRelatedBlogs(
          (related?.blogs || [])
            .filter((item) => item.slug !== slug)
            .slice(0, 3)
        );
        setStatus("ready");
      } catch {
        setStatus("not_found");
      }
    };
    load();
  }, [slug]);

  if (status === "loading") return <div className="py-12 text-center">Loading...</div>;
  if (status === "not_found") return <NotFound />;

  const canonicalUrl = blog.seo?.canonicalUrl || `https://www.punjabbulls.com/blogs/${slug}`;
  const metaTitle = blog.seo?.metaTitle || `${blog.title} | PunjabBulls Blog`;
  const metaDescription =
    blog.seo?.metaDescription || blog.excerpt || "Read this PunjabBulls blog article.";
  const keywords = blog.seo?.keywords || [];
  const authorName = blog.seo?.authorName || "PunjabBulls Technology Pvt. Ltd.";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": blog.seo?.schemaType || "BlogPosting",
    headline: blog.title,
    description: metaDescription,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    image: blog.seo?.ogImage?.url || blog.coverImage?.url,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    timeRequired: blog.readingTimeMinutes
      ? `PT${blog.readingTimeMinutes}M`
      : undefined,
    keywords,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "PunjabBulls Technology Pvt. Ltd.",
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blogs",
        item: "https://www.punjabbulls.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: blog.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <SEO
        title={metaTitle}
        description={metaDescription}
        keywords={keywords}
        canonical={canonicalUrl}
        ogImage={blog.seo?.ogImage?.url || blog.coverImage?.url}
        ogImageAlt={blog.seo?.ogImageAlt || blog.title}
        ogType="article"
        noindex={blog.seo?.noindex}
        article={{
          publishedTime: blog.createdAt,
          modifiedTime: blog.updatedAt || blog.createdAt,
          author: authorName,
          tags: keywords,
        }}
        schema={[articleSchema, breadcrumbSchema]}
      />
      <h1 className="text-4xl font-bold mb-4">
        {blog.title}
      </h1>

      <div className="mb-3 text-sm text-gray-500">
        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        {blog.readingTimeMinutes ? ` | ${blog.readingTimeMinutes} min read` : ""}
      </div>

      <p className="text-gray-600 mb-6">
        {blog.excerpt}
      </p>

      {blog.coverImage && (
        <img
          src={blog.coverImage.url}
          alt={blog.seo?.ogImageAlt || blog.title}
          loading="eager"
          className="w-full rounded-lg mb-8"
        />
      )}

      <BlogRenderer content={blog.content} />

      {relatedBlogs.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Related Posts</h2>
          <ul className="space-y-3">
            {relatedBlogs.map((item) => (
              <li key={item._id || item.slug}>
                <a href={`/blogs/${item.slug}`} className="text-blue-600 underline">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
