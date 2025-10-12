import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import landing from '@/landing.json'

export function MenuTemplate() {
  const [open, setOpen] = useState(false)
  const [isFixed, setIsFixed] = useState(false)

  // 🔹 Detecta scroll para “fixar” o menu
  useEffect(() => {
    const handleScroll = () => setIsFixed(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 🔹 Monta menu dinamicamente com base nas sections visíveis
  const menuItems = [
    { id: 'home', label: 'Início', visible: true },
    { id: 'about', label: 'Sobre', visible: true },
    {
      id: 'speakers',
      label: 'Participantes',
      visible: landing.participants?.visible !== false,
    },
    {
      id: 'schedule',
      label: 'Programação',
      visible: landing.schedule?.visible !== false,
    },
    {
      id: 'subscribe',
      label: 'Inscrição',
      visible: landing.subscribe?.visible !== false,
    },
    {
      id: 'previous-events',
      label: 'Edições Anteriores',
      visible: landing.previousEvents?.visible !== false,
    },
    { id: 'sponsors', label: 'Patrocínios', visible: false },
  ].filter(item => item.visible)

  return (
    <div
      className={`md:w-full md:flex md:justify-center ${
        isFixed ? 'md:pt-14' : ''
      }`}
    >
      <header
        className={`md:rounded-full md:px-12 z-50 transition-all duration-300 ${
          isFixed
            ? 'fixed md:top-3 md:bg-zinc-900/30 md:backdrop-blur-md md:shadow-lg md:border border-zinc-500 '
            : 'relative border-zinc-500'
        }`}
      >
        <div
          className={`container mx-auto px-4 md:py-3 flex md:justify-center items-center  transition-all duration-500 ${
            isFixed ? 'md:py-2' : 'md:py-2'
          }`}
        >
          {/* Menu desktop */}
          <nav className="hidden md:flex gap-8 text-base font-semibold">
            {menuItems.map(({ id, label }) => (
              <ScrollLink
                key={id}
                to={id}
                smooth
                duration={600}
                offset={-80}
                className="group relative cursor-pointer transition-all duration-300 text-[var(--text)] hover:text-[var(--light)] "
              >
                <span className="transition-all duration-200 group-hover:scale-105 group-hover:opacity-90 ]">
                  {label}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--light)] transition-all duration-300 group-hover:w-full" />
              </ScrollLink>
            ))}
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden pt-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="p-6 bg-zinc-700/90 backdrop-blur-md text-white h-screen border-none"
              >
                <nav className="flex flex-col gap-6 font-medium text-2xl mt-8 text-center justify-center items-center pt-32">
                  {menuItems.map(({ id, label }) => (
                    <ScrollLink
                      key={id}
                      to={id}
                      smooth
                      duration={600}
                      offset={-80}
                      className="cursor-pointer transition hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </ScrollLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  )
}
