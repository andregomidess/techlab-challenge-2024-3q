import { Box, MenuItem, Select, TextField } from "@mui/material";
//import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { api } from "../services/api";
// import { useAccessToken } from "../hooks/useAuthenticationContext";
import { IUser } from "../interfaces/IUser";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save'

export function NewUserScreen() {

//   const accessToken = useAccessToken()

//   const save = useMutation({
//     mutationFn: async (user: Partial<IUser>) => {
//       await api.put(`/users`, { ...user, id: self.crypto.randomUUID() }, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       })
//     }
//   })

//   const user = useQuery({
//     queryKey: ['users', userId],
//     queryFn: async () => {
//       const response = await api.get(`/users/${userId}`, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       })

//       return response.data as IUser
//     }
//   })

  const form = useForm<Partial<IUser>>({})

  return (
    <Box>
      <Box>
        <TextField label="Username" {...form.register('username')} fullWidth />
      </Box>
      <Box>
        <TextField label="E-mail" {...form.register('email')} fullWidth />
      </Box>
      <Box>
        <TextField label="Password" {...form.register('password')} type="password" fullWidth />
      </Box>
      <Box>
        <Select label="Profile" {...form.register('profile')} fullWidth>
          <MenuItem value='standard'>Standard</MenuItem>
          <MenuItem value='sudo'>Sudo</MenuItem>
        </Select>
      </Box>
      <Box>
      <LoadingButton variant="contained" style={{ padding: 16 }} startIcon={<SaveIcon />}
      >
        Salvar
      </LoadingButton>
      </Box>
    </Box>
  )
}