import { Box, Checkbox, FormControlLabel, MenuItem, Select, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EmptyObject, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import { ChangeEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const updateUserSchema = z.object({
  username: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().min(1, 'O email é obrigatório').email('E-mail inválido'),
  profile: z.string().min(1, 'O profile é obrigatório'),
  password: z.optional(z.string().min(1, 'A senha é obrigatória')),
  confirmPassword: z.optional(z.string().min(1, 'A confirmação da senha é obrigatória')),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não são iguais",
  path: ["confirmPassword"],
});

type UpdateUserSchema = z.infer<typeof updateUserSchema>

export function UserScreen() {
  const params = useParams()
  const userId = params.userId
  const [isChecked, setIsChecked] = useState(false);
  const [originalData, setOriginalData] = useState<UpdateUserSchema | EmptyObject>({}); // Inicializado com um objeto vazio

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  if (!userId) throw new Error('No userId provided')

  const accessToken = useAccessToken()

  const save = useMutation({
    mutationFn: async (user: Partial<UpdateUserSchema>) => {
      await api.patch(`/users/${userId}`, user, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    }
  })

  const user = useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as UpdateUserSchema
    }
  })

  const { register, handleSubmit, formState: {errors}, setValue } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema)
  })

  const onSubmit = (data: UpdateUserSchema) => {
    const changedData: Partial<UpdateUserSchema> = {};

    Object.keys(data).forEach((key) => {
      if (data[key as keyof UpdateUserSchema] !== originalData[key as keyof UpdateUserSchema]) {
        changedData[key as keyof UpdateUserSchema] = data[key as keyof UpdateUserSchema];
      }
    });

    if (isChecked) {
      changedData.password = data.password;
    }

    save.mutate(changedData);
  };

  useEffect(() => {
    if (!user.data) return;

    setOriginalData(user.data);

    Object.entries(user.data).map(([key, value]) => {
      setValue(key as keyof UpdateUserSchema, value ?? '');
    })
  }, [user.data])

  if (!user.data) return 'Carregando...'

  return (
    <Box>
      <Box>
        <TextField label="Username" {...register('username')} fullWidth />
      </Box>
      <Box>
        <TextField label="E-mail" {...register('email')} fullWidth />
      </Box>
      <Box>
        <Select label="Profile" {...register('profile')} defaultValue={user?.data.profile} fullWidth>
          <MenuItem value='standard'>Standard</MenuItem>
          <MenuItem value='sudo'>Sudo</MenuItem>
        </Select>
      </Box>
      <Box>
        <FormControlLabel control={<Checkbox onChange={handleCheckboxChange}/>} label="Redefinir senha" />
      </Box>
      {
      isChecked && 
      <>
        <Box>
          <TextField label="Nova Senha" {...register('password')} type="password" fullWidth />
        </Box>
        <Box>
          <TextField label="Confirmar nova senha" {...register('confirmPassword')} type="password" fullWidth />
        </Box>
      </>
      }
      <Box>
      <LoadingButton loading={save.isPending} variant="contained" style={{ padding: 16 }} startIcon={<SaveIcon />} onClick={
        handleSubmit(onSubmit)}
      >
        Salvar
      </LoadingButton>
      </Box>
    </Box>
  )
}
