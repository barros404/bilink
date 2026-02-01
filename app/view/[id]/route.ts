import { list } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Buscar o blob pelo nome do arquivo
    const { blobs } = await list({
      prefix: `${id}.html`,
      limit: 1,
    })

    if (blobs.length === 0) {
      return new NextResponse('Página não encontrada', { status: 404 })
    }

    const blob = blobs[0]

    // Buscar o conteúdo do blob
    const response = await fetch(blob.url)
    const html = await response.text()

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Erro ao buscar arquivo:', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}
