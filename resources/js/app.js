import './bootstrap'

import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.store('darkMode', { on: false })

const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')

Alpine.store('darkMode').on = darkModePreference.matches

darkModePreference.addEventListener('change', e => {
  Alpine.store('darkMode').on = e.matches
})

Alpine.start()
