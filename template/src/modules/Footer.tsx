export function Footer() {
  return (
    <div className="py-9 flex flex-col justify-center gap-6 text-center text-sm bg-gradient-to-t ">
      <div
        className=" w-32 md:w32 mx-auto
     aspect-[217.9/52.3]
    bg-[var(--text)] 
    [mask:url('/img/project/logo-editora-globo-negocios.svg')]
    [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]
    [-webkit-mask:url('/img/project/logo-editora-globo-negocios.svg')]
    [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]
  "
      ></div>

      <p className="px-12 text-[var(--text)]">
        Projeto desenvolvido e realizado pela Editora Globo. © 2025.
      </p>
    </div>
  )
}
