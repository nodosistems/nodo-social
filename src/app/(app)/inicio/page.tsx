import { Icon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'
import { Placeholder } from '@/components/placeholder'

export default function InicioPage() {
  return (
    <>
      <PageHeader title="Inicio" subtitle="Qué está pasando con tu Instagram y por qué." />
      <Placeholder
        icon={Icon.home}
        title="Tu resumen"
        lines={[
          'Estado de la cuenta, lo próximo que se publica y una explicación clara de lo que hace el asistente.',
        ]}
      />
    </>
  )
}
