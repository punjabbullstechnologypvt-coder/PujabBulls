import SEO from "../components/SEO";
import { staticRouteMeta } from "../seo/routes";

export default function Terms() {
  const meta = staticRouteMeta["/terms"];

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
      />
      <main />
    </>
  );
}
