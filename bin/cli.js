#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bold, cyan, gray, green, red } from 'kleur/colors'
import prompts from 'prompts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '..', 'template')

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

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', cwd, shell: process.platform === 'win32' })
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} falhou`))))
  })
}

async function main() {
  const argName = process.argv[2]
  let targetDir = argName

  if (!targetDir) {
    const res = await prompts({
      type: 'text',
      name: 'name',
      message: 'Nome do projeto:',
      initial: 'my-landing'
    })
    if (!res.name) {
      console.log(red('✖ Nome do projeto é obrigatório.'))
      process.exit(1)
    }
    targetDir = res.name.trim()
  }

  const dest = path.resolve(process.cwd(), targetDir)
  if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) {
    console.log(red(`✖ A pasta ${bold(targetDir)} não está vazia.`))
    process.exit(1)
  }

  console.log(gray('> Copiando arquivos...'))
  await copyDir(TEMPLATE_DIR, dest)

  // Ajusta package.json do projeto gerado
  const pkgPath = path.join(dest, 'package.json')
  try {
    const pkg = JSON.parse(await fsp.readFile(pkgPath, 'utf-8'))
    pkg.name = targetDir
    await fsp.writeFile(pkgPath, JSON.stringify(pkg, null, 2))
  } catch {
    // ignora se não tiver package.json
  }

  // Pergunta instalar deps
  const { install } = await prompts({
    type: 'toggle',
    name: 'install',
    message: 'Executar npm install agora?',
    initial: true,
    active: 'sim',
    inactive: 'não'
  })

  if (install) {
    console.log(gray('> Instalando dependências...'))
    await run('npm', ['install'], dest)
  }

  console.log(`\n${green('✔ Projeto criado com sucesso!\n')}`)
  console.log(cyan(`cd ${targetDir}`))
  if (!install) console.log(cyan('npm install'))
  console.log(cyan('npm run dev'))
  console.log(gray('\nHappy hacking!'))
}

main().catch(err => {
  console.error(red(err.stack || err.message))
  process.exit(1)
})
