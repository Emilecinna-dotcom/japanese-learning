interface RubyTextProps {
  text: string
  reading: string
  showFurigana: boolean
  className?: string
}

export function RubyText({ text, reading, showFurigana, className }: RubyTextProps) {
  if (!showFurigana) return <span className={className}>{text}</span>
  return (
    <ruby className={className}>
      {text}
      <rt className="text-[0.55em] text-primary/70 tracking-tight">{reading}</rt>
    </ruby>
  )
}
