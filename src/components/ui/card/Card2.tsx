import { ChevronRight, Clock, Check, Users, type LucideIcon, MoreVertical } from "lucide-react"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"

// Tipos para los permisos
interface Permission {
  id: string
  label: string
  enabled: boolean
}

interface CardProps {
  title?: string
  subtitle?: string
  icon?: LucideIcon
  updateDate?: string
  enabledButton?: boolean
  titleButton?: string
  onButton?: () => void
  link?: string
  permissions?: Permission[]
  totalUsers?: number
  userAvatars?: string[]
}

// Permisos predefinidos por tipo de rol
const getDefaultPermissions = (roleTitle: string): Permission[] => {
  const permissionSets: Record<string, Permission[]> = {
    'Administrador - Synkros': [
      { id: 'users', label: 'User Management', enabled: true },
      { id: 'system', label: 'System Configuration', enabled: true },
      { id: 'security', label: 'Security Controls', enabled: true },
      { id: 'analytics', label: 'Full Analytics Access', enabled: true },
    ],
    'Root - Synkros': [
      { id: 'full', label: 'Full System Access', enabled: true },
      { id: 'database', label: 'Database Management', enabled: true },
      { id: 'server', label: 'Server Administration', enabled: true },
      { id: 'backup', label: 'Backup & Recovery', enabled: true },
    ],
    'Marketing - MVNO': [
      { id: 'campaigns', label: 'Campaign Management', enabled: true },
      { id: 'analytics', label: 'Marketing Analytics', enabled: true },
      { id: 'content', label: 'Content Creation', enabled: true },
      { id: 'social', label: 'Social Media Access', enabled: false },
    ],
    'CallCenter - MVNO': [
      { id: 'tickets', label: 'Ticket Management', enabled: true },
      { id: 'customer', label: 'Customer Support', enabled: true },
      { id: 'calls', label: 'Call Monitoring', enabled: true },
      { id: 'reports', label: 'Support Reports', enabled: false },
    ],
    'Administrador - MVNO': [
      { id: 'mvno_users', label: 'MVNO User Management', enabled: true },
      { id: 'billing', label: 'Billing Administration', enabled: true },
      { id: 'network', label: 'Network Configuration', enabled: true },
      { id: 'compliance', label: 'Compliance Monitoring', enabled: true },
    ],
    'Soporte - MVNO': [
      { id: 'technical', label: 'Technical Support', enabled: true },
      { id: 'escalation', label: 'Issue Escalation', enabled: true },
      { id: 'knowledge', label: 'Knowledge Base Access', enabled: true },
      { id: 'documentation', label: 'Documentation Updates', enabled: false },
    ],
    'Root - MVNO': [
      { id: 'mvno_full', label: 'Full MVNO Access', enabled: true },
      { id: 'infrastructure', label: 'Infrastructure Control', enabled: true },
      { id: 'security_mvno', label: 'MVNO Security Management', enabled: true },
      { id: 'integration', label: 'System Integration', enabled: true },
    ]
  }

  return permissionSets[roleTitle] || [
    { id: 'basic', label: 'Basic Access', enabled: true },
    { id: 'read', label: 'Read Permissions', enabled: true },
    { id: 'write', label: 'Write Permissions', enabled: false }
  ]
}

const Card2 = ({
  title = "",
  subtitle,
  icon: Icon = Users,
  updateDate,
  enabledButton = true,
  titleButton = "Details",
  onButton,
  permissions,
  // totalUsers = 5,
}: CardProps) => {

  const cardRef = useRef<HTMLDivElement>(null)
  const permissionsRef = useRef<HTMLDivElement>(null)

  // Usar permisos pasados como prop o generar por defecto
  const rolePermissions = permissions || getDefaultPermissions(title)
  const enabledPermissions = rolePermissions.filter(p => p.enabled)

  // Animación de entrada
  useEffect(() => {
    if (cardRef.current && permissionsRef.current) {
      const tl = gsap.timeline()

      // Animación de la carta
      tl.fromTo(cardRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
      )

      // Animación escalonada de los permisos
      tl.fromTo(permissionsRef.current.children,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.3"
      )
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="bg-gradient-to-br from-[#F7FAFF] to-[#EEF4FF] p-6 rounded-xl transition-all duration-300 border border-gray-100/50"
    >
      {/* Header con icono y título */}
      <div className="flex gap-4 items-start mb-6">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <Icon className="w-6 h-6 text-[#44556F]" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-bold text-lg text-[#44556F] leading-tight">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{subtitle}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
          <MoreVertical />
        </button>
      </div>

      {/* Lista de permisos */}
      <div ref={permissionsRef} className="space-y-3 mb-6">
        {enabledPermissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-5 h-5 bg-emerald-100 rounded-full flex-shrink-0">
              <Check className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              {permission.label}
            </span>
          </div>
        ))}
      </div>

      {/* Sección de usuarios */}
      {/* <div className="mb-6">
        <p className="text-sm text-gray-500 mb-3">Total {totalUsers} users</p>
      </div> */}

      {/* Footer con fecha y botón */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span className="text-xs">{updateDate}</span>
        </div>

        {enabledButton && (
          <button
            onClick={onButton}
            className="bg-[#44556F] text-white px-4 py-2 text-xs rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#3a485e] transition-all duration-200 hover:shadow-md"
          >
            <span className="font-medium">{titleButton}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Card2