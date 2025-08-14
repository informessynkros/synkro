// Componente del botón de notificaciones

import { Bell } from "lucide-react"


interface ButtonNotificationProps {
  numberNotifications?: number
  notificationsOpen: boolean
  setNotificationsOpen: () => void
}

const ButtonNotification = ({
  numberNotifications = 0,
  // notificationsOpen,
  // setNotificationsOpen
}: ButtonNotificationProps) => {
  return (
    <>
      <button
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00555A] relative"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        <span className="absolute -top-1 -right-1 bg-[#00555A] text-white text-xs rounded-md h-5 w-5 flex items-center justify-center">
          {numberNotifications}
        </span>
      </button>
    </>
  )
}

export default ButtonNotification
