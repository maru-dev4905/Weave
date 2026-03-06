export function Section({
  eyebrow,
  title,
  description,
  id,
  children,
  align = 'default',
}) {
  return (
    <section id={id} className={`content_section section_align_${align}`}>
      <div className="section_header">
        {eyebrow ? <span className="section_eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
