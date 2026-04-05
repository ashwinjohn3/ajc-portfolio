// app/components/ObfuscatedEmail.tsx
'use client'

import { MailIcon } from './SocialIcons'

// ashwinchempolil@gmail.com encoded as char codes — never in server-rendered HTML
const EMAIL_CODES = [97,115,104,119,105,110,99,104,101,109,112,111,108,105,108,64,103,109,97,105,108,46,99,111,109]

interface Props {
  style?: React.CSSProperties
}

export default function ObfuscatedEmail({ style }: Props) {
  const email = EMAIL_CODES.map(c => String.fromCharCode(c)).join('')
  return (
    <a
      href={`mailto:${email}`}
      aria-label="Email"
      style={style}
    >
      <MailIcon size={18} />
    </a>
  )
}
