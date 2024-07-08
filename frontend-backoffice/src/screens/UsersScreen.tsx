import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api.js"
import { useAccessToken } from "../hooks/useAuthenticationContext.js"
import { IUser } from "../interfaces/IUser.js"
import { Box } from "@mui/material"
import TableUser from "../components/TableUser.js"
import TitlePage from "../components/TitlePage.js"

export function UsersScreen() {
  const accessToken = useAccessToken()
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as {
        count: number
        users: IUser[]
      }
    },
  })

  const users = query.data?.users ?? []

  return (
    <Box p={3}>
    <TitlePage title="Usuário"/>
      <Box padding={'1rem 4rem 1rem 4rem'}>
        <TableUser initialRows={users} accessToken={accessToken}/>
      </Box>
    </Box>
  )
}