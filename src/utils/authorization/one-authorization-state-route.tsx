import { ReactNode, useContext, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { PATH } from '@/config'
import { AuthContext } from '@/utils/authorization'

interface Props {
  children: ReactNode
  authorized: boolean
}

export const OneAuthorizationStateRoute = (props: Props) => {
  const { children, authorized } = props
  const context = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!context.loading && authorized !== context.authorized) {
      router.replace(authorized ? PATH.LOGIN : PATH.CONTAINERS).then()
    }
  }, [authorized, context.authorized, context.loading, router])

  return useMemo(
    () => (
      <>{!context.loading && context.authorized === authorized && children}</>
    ),
    [authorized, children, context.authorized, context.loading],
  )
}
