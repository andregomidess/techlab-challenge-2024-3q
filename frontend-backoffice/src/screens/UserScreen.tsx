import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EmptyObject, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import { ChangeEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TitlePage from "../components/TitlePage";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const updateUserSchema = z
  .object({
    username: z.string().min(1, "O nome é obrigatório"),
    email: z.string().min(1, "O email é obrigatório").email("E-mail inválido"),
    profile: z.string().min(1, "O profile é obrigatório"),
    password: z.optional(z.string().min(1, "A senha é obrigatória")),
    confirmPassword: z.optional(
      z.string().min(1, "A confirmação da senha é obrigatória")
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não são iguais",
    path: ["confirmPassword"],
  });

type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export function UserScreen() {
  const params = useParams();
  const userId = params.userId;
  const [isChecked, setIsChecked] = useState(false);
  const [originalData, setOriginalData] = useState<
    UpdateUserSchema | EmptyObject
  >({});
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

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  if (!userId) throw new Error("No userId provided");

  const accessToken = useAccessToken();

  const save = useMutation({
    mutationFn: async (user: Partial<UpdateUserSchema>) => {
      await api.patch(`/users/${userId}`, user, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      handleClick()
    }
  });

  const user = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data as UpdateUserSchema;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
  });

  const onSubmit = (data: UpdateUserSchema) => {
    const changedData: Partial<UpdateUserSchema> = {};

    Object.keys(data).forEach((key) => {
      if (
        data[key as keyof UpdateUserSchema] !==
        originalData[key as keyof UpdateUserSchema]
      ) {
        changedData[key as keyof UpdateUserSchema] =
          data[key as keyof UpdateUserSchema];
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
      setValue(key as keyof UpdateUserSchema, value ?? "");
    });
  }, [user.data]);

  if (!user.data) return "Carregando...";

  return (
    <Box p={3}>

      <TitlePage title="Edição usuário" />

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
        
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Usuário editado com sucesso!
        </Alert>
      </Snackbar>

      <Box
        p={4}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        height={"75vh"}
        overflow={"auto"}
      >
        <Box marginBottom={"1rem"} width={"30rem"}>
          <TextField
            label="Username"
            {...register("username")}
            size="small"
            fullWidth
          />
        </Box>
        <Box marginBottom={"1rem"} width={"30rem"}>
          <TextField
            label="E-mail"
            {...register("email")}
            size="small"
            fullWidth
          />
        </Box>
        <Box marginBottom={"1rem"} width={"30rem"}>
          <Select
            size="small"
            label="Profile"
            {...register("profile")}
            defaultValue={user?.data.profile}
            fullWidth
          >
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="sudo">Sudo</MenuItem>
          </Select>
        </Box>
        <Box>
          <FormControlLabel
            control={<Checkbox onChange={handleCheckboxChange} />}
            label="Redefinir senha"
          />
        </Box>
        {isChecked && (
          <>
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
                size="small"
                label="Nova Senha"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                fullWidth
              />
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
                size="small"
                label="Confirmar nova senha"
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
              />
            </Box>
          </>
        )}
        <Box  display="flex" justifyContent="flex-start"  >
          <LoadingButton
            loading={save.isPending}
            variant="contained"
            style={{ padding: 16 }}
            startIcon={<SaveIcon />}
            onClick={handleSubmit(onSubmit)}
          >
            Salvar
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
