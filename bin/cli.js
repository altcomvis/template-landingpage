#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bold, cyan, gray, green, red, yellow } from 'kleur/colors'
import prompts from 'prompts'

/*──────────────────────────────────────────────*/
/* 🔹 Configuração inicial */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '..', 'template')

/*──────────────────────────────────────────────*/
/* 🔹 Função para copiar diretórios recursivamente */
async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true })
  const entries = await fsp.readdir(src, { withFileTypes: true })
  for (const e of entries) {
    const srcPath = path.join(src, e.name)
    const destPath = path.join(dest, e.name)
    if (e.isDirectory()) await copyDir(srcPath, destPath)
    else await fsp.copyFile(srcPath, destPath)
  }
}

/*──────────────────────────────────────────────*/
/* 🔹 Executa comando (npm install etc.) */
function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      cwd,
      shell: process.platform === 'win32'
    })
    p.on('close', code =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args.join(' ')} falhou com código ${code}`))
    )
  })
}

/*──────────────────────────────────────────────*/
/* 🔹 Programa principal */
async function main() {
  console.log(cyan('\n🚀 Criador de Landing Pages - Template Globo\n'))

  // 1️⃣ Nome do projeto
  let targetDir = process.argv[2]

  if (!targetDir) {
    const res = await prompts({
      type: 'text',
      name: 'name',
      message: 'Nome do projeto:',
      initial: 'lp-meu-projeto'
    })
    if (!res.name) {
      console.log(red('✖ Nome do projeto é obrigatório.'))
      process.exit(1)
    }
    targetDir = res.name.trim()
  }

  const dest = path.resolve(process.cwd(), targetDir)

  // 2️⃣ Confere se pasta existe
  if (fs.existsSync(dest)) {
    const files = await fsp.readdir(dest)
    if (files.length > 0) {
      const { overwrite } = await prompts({
        type: 'toggle',
        name: 'overwrite',
        message: `A pasta ${bold(targetDir)} já existe e contém arquivos. Deseja sobrescrever?`,
        initial: false,
        active: 'sim',
        inactive: 'não'
      })
      if (!overwrite) {
        console.log(red('✖ Operação cancelada.'))
        process.exit(1)
      }
      await fsp.rm(dest, { recursive: true, force: true })
      console.log(gray(`🗑️  Pasta existente removida.`))
    }
  }

  // 3️⃣ Copia template
  console.log(gray('> Copiando arquivos do template...\n'))
  await copyDir(TEMPLATE_DIR, dest)

  // 4️⃣ Ajusta nome no package.json do projeto
  const pkgPath = path.join(dest, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(await fsp.readFile(pkgPath, 'utf-8'))
      pkg.name = targetDir
      await fsp.writeFile(pkgPath, JSON.stringify(pkg, null, 2))
      console.log(gray('> package.json atualizado.'))
    } catch {
      console.log(yellow('⚠️  Não foi possível atualizar o package.json.'))
    }
  }

  // 5️⃣ Pergunta se deseja instalar dependências
  const { install } = await prompts({
    type: 'toggle',
    name: 'install',
    message: 'Executar npm install agora?',
    initial: true,
    active: 'sim',
    inactive: 'não'
  })

  if (install) {
    console.log(gray('\n> Instalando dependências...\n'))
    try {
      await run('npm', ['install'], dest)
    } catch (err) {
      console.log(red(`❌ Falha ao executar npm install: ${err.message}`))
    }
  }

  // 6️⃣ Mensagem final
  console.log(`\n${green('✔ Projeto criado com sucesso!\n')}`)
  console.log(cyan(`cd ${targetDir}`))
  if (!install) console.log(cyan('npm install'))
  console.log(cyan('npm run dev'))
  console.log(gray('\nHappy hacking!\n'))
}

/*──────────────────────────────────────────────*/
/* 🔹 Execução */
main().catch(err => {
  console.error(red(err.stack || err.message))
  process.exit(1)
})