import { saveAs } from 'file-saver'
import { del, get, set } from 'idb-keyval'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { LandingData } from '../Admin'

interface DownloadJsonProps {
  data: LandingData
  setData: React.Dispatch<React.SetStateAction<LandingData>>
  initialData: LandingData
}

type DialogType = 'success' | 'error' | 'confirm' | null

export default function DownloadJson({
  data,
  setData,
  initialData,
}: DownloadJsonProps) {
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [dialogMessage, setDialogMessage] = useState('')
  const [dialogTitle, setDialogTitle] = useState('')
  const [open, setOpen] = useState(false)

  // 🔹 Carrega dados salvos
  useEffect(() => {
    get('landingData').then(saved => {
      if (saved) setData(saved)
    })
  }, [setData])

  // 🔹 Salva a cada alteração
  useEffect(() => {
    set('landingData', data)
  }, [data])

  /* ──────────────────────────────── */
  // 📦 Exportar JSON
  const handleDownload = () => {
    try {
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
      saveAs(blob, 'landing.json')
      setDialogTitle('Download concluído')
      setDialogMessage(
        'O arquivo landing.json foi gerado com sucesso! Agora basta substituí-lo na pasta "src" do projeto.'
      )
      setDialogType('success')
      setOpen(true)
    } catch (err) {
      console.error('Erro ao gerar JSON:', err)
      setDialogTitle('Erro ao exportar')
      setDialogMessage('Não foi possível gerar o arquivo JSON.')
      setDialogType('error')
      setOpen(true)
    }
  }

  /* ──────────────────────────────── */
  // 📂 Importar JSON
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        setData(parsed)
        set('landingData', parsed)
        setDialogTitle('Importação concluída')
        setDialogMessage('Arquivo importado com sucesso!')
        setDialogType('success')
      } catch (err) {
        console.error('Erro ao importar JSON:', err)
        setDialogTitle('Erro ao importar')
        setDialogMessage('O arquivo não é válido. Verifique o formato JSON.')
        setDialogType('error')
      } finally {
        setOpen(true)
      }
    }
    reader.readAsText(file)
  }

  /* ──────────────────────────────── */
  // 🧹 Resetar dados
  const handleReset = () => {
    setDialogTitle('Confirmar reset')
    setDialogMessage('Tem certeza que deseja resetar todos os dados do Admin?')
    setDialogType('confirm')
    setOpen(true)
  }

  const confirmReset = async () => {
    await del('landingData')
    localStorage.removeItem('landingData')
    setData(initialData)
    setOpen(false)
    setDialogTitle('Admin resetado')
    setDialogMessage('Todos os dados foram apagados.')
    setDialogType('success')
    setTimeout(() => setOpen(true), 100)
  }

  /* ──────────────────────────────── */
  return (
    <div className="text-center mt-10 flex flex-col gap-3 items-center">
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 text-base"
        >
          📦 Baixar landing.json
        </Button>

        <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-base">
          📂 Carregar JSON
          <input
            type="file"
            accept="application/json"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        <Button variant="outline" onClick={handleReset}>
          Resetar Admin
        </Button>
      </div>

      <p className="text-sm text-gray-500 mt-2 max-w-md">
        Exporte, importe ou resete os dados completos do Admin via{' '}
        <code>landing.json</code>.
      </p>

      {/* ──────────────── */}
      {/* 🪟 Dialog genérico */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            {dialogType === 'confirm' ? (
              <>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmReset}>
                  Confirmar
                </Button>
              </>
            ) : (
              <Button onClick={() => setOpen(false)}>Fechar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
