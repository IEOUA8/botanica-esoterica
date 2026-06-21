import { Link } from 'react-router-dom'

const styles = {
  primary: 'bg-terracotta text-white hover:bg-[#9f3a10]',
  secondary: 'bg-gold text-deep hover:bg-[#d6b65d]',
  outline: 'border border-gold/60 text-deep hover:bg-gold/10',
  ghost: 'text-deep hover:bg-ritual',
}

export default function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const base =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
  const classes = `${base} ${styles[variant]} ${className}`

  if (to) return <Link className={classes} to={to}>{children}</Link>
  if (href) return <a className={classes} href={href} target="_blank" rel="noreferrer">{children}</a>
  return <button className={classes} {...props}>{children}</button>
}
