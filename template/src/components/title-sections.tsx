type TitleProps = {
  name: string
  description?: string
}

export function TitleSection({ name, description }: TitleProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2 text-[var(--light)]">{name}</h2>
      {description && (
        <p className="text-[var(--text)] max-w-2xl text-base mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
