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


// import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;

  return <main>{slug}</main>;
}
