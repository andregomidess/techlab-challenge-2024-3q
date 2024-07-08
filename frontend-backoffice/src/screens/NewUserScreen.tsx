import { Alert, Box, IconButton, InputAdornment, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../services/api";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { zodResolver } from "@hookform/resolvers/zod";
import TitlePage from "../components/TitlePage";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const newUserSchema = z
  .object({
    username: z.string().min(1, "O nome é obrigatório"),
    email: z.string().min(1, "O email é obrigatório").email("E-mail inválido"),
    profile: z.string().min(1, "O profile é obrigatório"),
    password: z.string().min(1, "A senha é obrigatória"),
    confirmPassword: z.string().min(1, "A confirmação da senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não são iguais",
    path: ["confirmPassword"],
  });

type NewUserSchema = z.infer<typeof newUserSchema>;

export function NewUserScreen() {
  const accessToken = useAccessToken();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const save = useMutation({
    mutationFn: async (user: NewUserSchema) => {
      await api.post("/users", user, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewUserSchema>({
    resolver: zodResolver(newUserSchema),
  });
  return (
    <Box p={3}>
      <TitlePage title="Criar novo usuário"/>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Usuário criado com sucesso!
        </Alert>
      </Snackbar>
      <Box
        height={'70vh'}
        overflow={'auto'}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Box marginBottom={"1rem"} width={"30rem"}>
          <TextField
            label="Nome do usuário"
            {...register("username")}
            fullWidth
          />
          {errors.username && <span style={{color: 'red', fontSize: '.75rem'}}>{errors.username.message}</span>}
        </Box>
        <Box marginBottom={"1rem"} width={"30rem"}>
          <TextField label="E-mail" {...register("email")} fullWidth />
          {errors.email && <span style={{color: 'red', fontSize: '.75rem'}}>{errors.email.message}</span>}
        </Box>
        <Box marginBottom={"1rem"} width={"30rem"}>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Senha"
            {...register("password")}
            type="password"
            fullWidth
          />
          {errors.password && <span style={{color: 'red', fontSize: '.75rem'}}>{errors.password.message}</span>}
        </Box>
        <Box marginBottom={"1rem"} width={"30rem"}>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Confirmar senha"
            {...register("confirmPassword")}
            type="password"
            fullWidth
          />
          {errors.confirmPassword && (
            <span style={{color: 'red', fontSize: '.75rem'}}>{errors.confirmPassword.message}</span>
          )}
        </Box>
        <Box marginBottom={"1rem"} width={"30rem"}>
          <Select label="Profile" {...register("profile")} fullWidth>
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="sudo">Sudo</MenuItem>
          </Select>
          {errors.profile && <span style={{color: 'red', fontSize: '.75rem'}}>{errors.profile.message}</span>}
        </Box>
        <Box>
          <LoadingButton
            variant="contained"
            style={{ padding: 16 }}
            startIcon={<SaveIcon />}
            onClick={
              // @ts-expect-error: I know exactly what I'm doing ok?
              handleSubmit(save.mutate)
            }
          >
            Salvar
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
