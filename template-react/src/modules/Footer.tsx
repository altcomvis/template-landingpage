export function Footer() {
  return (
    <div className="py-9 flex flex-col text-zinc-400 bg-zinc-900 justify-center gap-6 text-center text-sm md:mt-12 border-t border-zinc-600">
      <div
        className=" w-32 md:w32 mx-auto bg-zinc-400
     aspect-[217.9/52.3]

    [mask:url('/img/project/logo-editora-globo-negocios.svg')]
    [mask-no-repeat] [mask-center] [mask-contain]
    [-webkit-mask:url('/img/project/logo-editora-globo-negocios.svg')]
    [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]
  "
      ></div>

      <p className="px-12 ">
        Projeto desenvolvido e realizado pela Editora Globo. ©{' '}
        {new Date().getFullYear()}.
      </p>
    </div>
  )
}
