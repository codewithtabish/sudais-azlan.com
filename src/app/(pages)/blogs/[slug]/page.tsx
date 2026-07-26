// // import { getBlogBySlugAction } from "@/actions/(blogs)/get-blog-by-slug";
// // import { notFound } from "next/navigation";

// type PageProps = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// export default async function SingleBlogPage({ params }: PageProps) {
//   const { slug } = await params;

// //   const result = await getBlogBySlugAction(slug);

// //   if (!result.success || !result.data) {
// //     notFound();
// //   }

//   return <main>Blog works</main>;
// }

import React from 'react'

const SingleBlogPage = () => {
  return (
    <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis accusamus praesentium repudiandae esse molestiae quos, et tenetur nam. Fugit, asperiores blanditiis deserunt explicabo velit vitae error similique? Libero, soluta sint.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis accusamus praesentium repudiandae esse molestiae quos, et tenetur nam. Fugit, asperiores blanditiis deserunt explicabo velit vitae error similique? Libero, soluta sint.
      
    </div>
  )
}

export default SingleBlogPage
