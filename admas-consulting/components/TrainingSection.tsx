interface TrainingSectionProps {
  id: string
  title: string
  items: string[]
}

export default function TrainingSection({ id, title, items }: TrainingSectionProps) {
  return (
    <section id={id} className="rounded-3xl bg-white/5 px-8 py-10 shadow-[0_12px_35px_rgba(8,8,15,0.35)] backdrop-blur-md">
      <h3 className="text-2xl font-heading font-semibold text-white mb-6">{title}</h3>
      <ul className="space-y-3 text-base leading-relaxed text-white/85">
        {items.map((item, index) => (
          <li key={`${id}-${index}`} className="pl-1">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

