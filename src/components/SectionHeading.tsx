type Props = {
  eyebrow: string
  title: React.ReactNode
  desc?: string
  align?: 'center' | 'left'
}

export default function SectionHeading({
  eyebrow,
  title,
  desc,
  align = 'center',
}: Props) {
  const isCenter = align === 'center'
  return (
    <div className={isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-bold text-brand-700">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
      {desc && (
        <p className={`mt-4 text-lg leading-relaxed text-muted ${isCenter ? 'mx-auto' : ''}`}>
          {desc}
        </p>
      )}
    </div>
  )
}
