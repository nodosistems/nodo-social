import { Icon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'
import { Placeholder } from '@/components/placeholder'

export default function PublicacionesPage() {
  return (
    <>
      <PageHeader title="Publicaciones" subtitle="Todo lo que ya está en tu Instagram, con sus métricas." />
      <Placeholder
        icon={Icon.grid}
        title="Tus publicaciones"
        lines={[
          'La galería de todo lo publicado, con alcance e interacción cuando conectemos las métricas.',
        ]}
      />
    </>
  )
}
