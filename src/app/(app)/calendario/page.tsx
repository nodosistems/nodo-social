import { Icon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'
import { Placeholder } from '@/components/placeholder'

export default function CalendarioPage() {
  return (
    <>
      <PageHeader title="Calendario" subtitle="Lo publicado y lo que viene, con la idea de cada pieza." />
      <Placeholder
        icon={Icon.calendar}
        title="Tu calendario editorial"
        lines={[
          'Pasado y futuro en un vistazo: cada reel, carrusel o post con su idea.',
          'Podrás cambiar una pieza o generar otra con IA antes de que se publique.',
        ]}
      />
    </>
  )
}
