import { MenuTemplate } from '@/components/menu-template'

export function Header() {
  return (
    <div className="fixed md:static w-full z-50">
      <MenuTemplate />
    </div>
  )
}
