// app/components/ObfuscatedEmail.tsx
'use client'

// Email encoded as Unicode char codes (matching the technique used by andrew.hedges.name/experiments/obfuscator/)
// Never appears as plain text in server-rendered HTML — built at runtime in the browser only.
// ashwinchempolil@gmail.com
const EMAIL_CODES = [97,115,104,119,105,110,99,104,101,109,112,111,108,105,108,64,103,109,97,105,108,46,99,111,109]

interface Props {
  style?: React.CSSProperties
}

export default function ObfuscatedEmail({ style }: Props) {
  const email = EMAIL_CODES.map(c => String.fromCharCode(c)).join('')
  return (
    <a href={`mailto:${email}`} style={style}>
      {email}
    </a>
  )
}
