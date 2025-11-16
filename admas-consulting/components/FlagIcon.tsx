"use client"

interface FlagIconProps {
  country: 'gb' | 'de'
  className?: string
}

export default function FlagIcon({ country, className = '' }: FlagIconProps) {
  const baseClasses = "inline-block w-5 h-4 rounded-sm flex-shrink-0"
  
  if (country === 'gb') {
    // British flag (Union Jack)
    return (
      <svg
        viewBox="0 0 640 480"
        className={`${baseClasses} ${className}`}
        role="img"
        aria-label="British flag"
      >
        <defs>
          <clipPath id="gb-a">
            <path fillOpacity=".7" d="M-85.3 0h682.6v512h-682.6z"/>
          </clipPath>
        </defs>
        <g clipPath="url(#gb-a)" transform="translate(80) scale(.94)">
          <g strokeWidth="1pt">
            <path fill="#006" d="M-256 0H768v512H-256z"/>
            <path fill="#fff" d="m-256 0 832 512m0-512L-256 512" stroke="#fff" strokeWidth="74.7"/>
            <path fill="#fff" d="M-256 0H768M-256 256H768m0-256v512" stroke="#fff" strokeWidth="85.3"/>
            <path fill="#c00" d="m-256 0 832 512m0-512L-256 512" stroke="#c00" strokeWidth="51.2"/>
            <path fill="#c00" d="M-256 256H768m-256-256v512" stroke="#c00" strokeWidth="64"/>
            <path fill="#c00" d="M128 0v512M-256 256h512" stroke="#c00" strokeWidth="69.3"/>
          </g>
        </g>
      </svg>
    )
  }
  
  if (country === 'de') {
    // German flag (tricolor: black, red, gold)
    return (
      <svg
        viewBox="0 0 5 3"
        className={`${baseClasses} ${className}`}
        role="img"
        aria-label="German flag"
      >
        <rect width="5" height="1" fill="#000"/>
        <rect y="1" width="5" height="1" fill="#d00"/>
        <rect y="2" width="5" height="1" fill="#ffce00"/>
      </svg>
    )
  }
  
  return null
}

