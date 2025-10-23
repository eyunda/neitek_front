import clsx from "clsx";

export default function Typography({
  as: Tag = "h1",
  variant = "h3",         // "h1".."h6" o "display-1".."display-6"
  weight = "700",
  align = "start",        // start | center | end
  color = "default",      // default | muted | primary | gradient
  icon,                   // ej: "bi-people"
  subtitle,
  className,
  children,
}) {
  const v = variant;
  const colorClass = {
    default: "", muted: "text-muted", primary: "text-primary", gradient: "typo-gradient"
  }[color];

  return (
    <div className={clsx("typo-wrap", `text-${align}`, className)}>
      <Tag className={clsx(v, "mb-1", colorClass)} style={{ fontWeight: weight }}>
        {icon && <i className={`bi ${icon} me-2`} aria-hidden="true" />}
        {children}
      </Tag>
      {subtitle && <div className="typo-subtitle text-muted">{subtitle}</div>}
      <div className="typo-underline" />
    </div>
  );
}
