import { Icon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'
import { Placeholder } from '@/components/placeholder'

export default function MiMarcaPage() {
  return (
    <>
      <PageHeader title="Mi marca" subtitle="Tu negocio, tu tono y tus normas. El asistente lo usa en todo." />
      <Placeholder
        icon={Icon.brand}
        title="La identidad de tu marca"
        lines={[
          'Negocio, público, tono de voz, de qué sí hablar y de qué no.',
          'Lo configuras una vez y el asistente lo respeta en cada pieza que crea.',
        ]}
      />
    </>
  )
}
