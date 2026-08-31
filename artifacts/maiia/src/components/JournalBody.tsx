const IMAGE_MARKDOWN = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export function renderJournalBody(body: string) {
  return body.split('\n\n').map((block, index) => {
    const imageMatch = block.trim().match(IMAGE_MARKDOWN);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      return (
        <figure key={index} className="my-10">
          <div className="aspect-[16/10] w-full bg-muted overflow-hidden">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {alt ? (
            <figcaption className="mt-3 text-center text-sm text-foreground/50 font-light tracking-wide">
              {alt}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    return (
      <p key={index} className="text-lg font-light text-foreground/80 leading-[1.85]">
        {block}
      </p>
    );
  });
}
