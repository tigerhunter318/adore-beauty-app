import { useCategoryContext } from '../../category/CategoryProvider'
import { useSidebar, useSidebarContent } from '../../sidebar/SidebarContext'

const useCategoryProductsSidebar = (component: React.ReactNode, deps = []) => {
  const { setSidebarType } = useCategoryContext()
  const { openDrawer } = useSidebar()

  useSidebarContent(component, deps)

  const openSidebar = (type: string) => {
    setSidebarType(type)
    openDrawer()
  }

  return { openSidebar }
}

export default useCategoryProductsSidebar
