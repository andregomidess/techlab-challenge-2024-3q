import { Box, MenuItem, Select, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { api } from "../services/api";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save'
import { zodResolver } from "@hookform/resolvers/zod";

const newUserSchema = z.object({
  username: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().min(1, 'O email é obrigatório').email('E-mail inválido'),
  profile: z.string().min(1, 'O profile é obrigatório'),
  password: z.string().min(1, 'A senha é obrigatória'),
  confirmPassword: z.string().min(1, 'A confirmação da senha é obrigatória'),
})
.refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não são iguais",
        path: ["confirmPassword"],
});
    
type NewUserSchema = z.infer<typeof newUserSchema>

export function NewUserScreen() {

  const accessToken = useAccessToken()

  const save = useMutation({
    mutationFn: async (user: NewUserSchema) => {
      await api.post('/users', 
        user,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
    }
  })

  const { register, handleSubmit, formState: {errors} } = useForm<NewUserSchema>({
    resolver: zodResolver(newUserSchema)
  })
  //TODO: ajustar layout
  return (
    <Box>
      <Box>
        <TextField label="Nome do usuário" {...register('username')} fullWidth />
        {errors.username && <span>{ errors.username.message }</span>}
      </Box>
      <Box>
        <TextField label="E-mail" {...register('email')} fullWidth />
        {errors.email && <span>{ errors.email.message }</span>}
      </Box>
      <Box>
        <TextField label="Senha" {...register('password')} type="password" fullWidth />
        {errors.password && <span>{ errors.password.message }</span>}
      </Box>
      <Box>
        <TextField label="Confirmar senha" {...register('confirmPassword')} type="password" fullWidth />
        {errors.confirmPassword && <span>{ errors.confirmPassword.message }</span>}
      </Box>
      <Box>
        <Select label="Profile" {...register('profile')} fullWidth>
          <MenuItem value='standard'>Standard</MenuItem>
          <MenuItem value='sudo'>Sudo</MenuItem>
        </Select>
        {errors.profile && <span>{ errors.profile.message }</span>}
      </Box>
      <Box>
        <LoadingButton variant="contained" style={{ padding: 16 }} startIcon={<SaveIcon />} onClick={
          // @ts-expect-error: I know exactly what I'm doing ok?
          handleSubmit(save.mutate)
        }
      >
        Salvar
      </LoadingButton>
      </Box>
    </Box>
  )
}