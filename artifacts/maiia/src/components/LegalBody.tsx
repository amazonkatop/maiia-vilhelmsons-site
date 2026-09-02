export function renderLegalBody(body: string) {
  return body.split('\n\n').map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={index}
          className="font-serif text-2xl md:text-3xl mt-12 mb-4 first:mt-0"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }

    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((line) => line.startsWith('- '));
      return (
        <ul
          key={index}
          className="list-disc pl-6 space-y-2 text-lg font-light text-foreground/80 leading-[1.85]"
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{item.slice(2)}</li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={index}
        className="text-lg font-light text-foreground/80 leading-[1.85]"
      >
        {trimmed}
      </p>
    );
  });
}
