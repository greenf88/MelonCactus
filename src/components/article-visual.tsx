import Image from "next/image";
import type { ArticleVisual as ArticleVisualData } from "@/data/article-visuals";

export function ArticleVisual({ visual }: { visual: ArticleVisualData }) {
  return <figure className="article-visual">
    <div className="article-visual-media">
      <Image
        alt={visual.alt}
        className="article-visual-image article-visual-image-desktop"
        height={visual.height}
        loading="lazy"
        sizes="70ch"
        src={visual.src}
        unoptimized
        width={visual.width}
      />
      <Image
        alt={visual.alt}
        className="article-visual-image article-visual-image-mobile"
        height={visual.mobileHeight}
        loading="lazy"
        sizes="calc(100vw - 3rem)"
        src={visual.mobileSrc}
        unoptimized
        width={visual.mobileWidth}
      />
    </div>
    <figcaption>
      <strong>{visual.title}</strong>
      <p>{visual.caption}</p>
      <dl aria-label={visual.explanationLabel} className="article-visual-explanation">
        {visual.details.map((detail) => <div key={detail.label}>
          <dt>{detail.label}</dt>
          <dd>{detail.text}</dd>
        </div>)}
      </dl>
    </figcaption>
  </figure>;
}
