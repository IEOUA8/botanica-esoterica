import { useState } from 'react'

export default function Tabs({ tabs, defaultTab, children }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  return (
    <div>
      <div className="flex overflow-x-auto border-b border-gold/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative shrink-0 px-5 py-3 text-sm font-semibold transition ${
              active === tab.id ? 'text-forest' : 'text-incense/60 hover:text-forest'
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {typeof children === 'function' ? children(active) : children}
      </div>
    </div>
  )
}
