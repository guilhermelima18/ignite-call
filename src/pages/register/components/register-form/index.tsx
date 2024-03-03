"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Text } from "@ignite-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ArrowRight } from "phosphor-react";
import { useUsers } from "@/hooks/useUsers";
import { Input } from "@/components/input";
import { Form, FormError } from "./styles";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 letras." })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hífens.",
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: "O nome precisa ter pelo menos 3 letras." }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      name: "",
    },
  });

  const router = useRouter();
  const { createUser } = useUsers();

  async function handleRegister(data: RegisterFormData) {
    const user = {
      name: data.name,
      username: data.username,
    };

    await createUser(user);

    await router.push("/register/connect-calendar");
  }

  useEffect(() => {
    const username = router.query?.username;

    if (router.query.username) {
      setValue("username", username as string);
    }
  }, [router.query?.username, setValue]);

  return (
    <Form as="form" onSubmit={handleSubmit(handleRegister)}>
      <label>
        <Text size="sm">Nome de usuário</Text>
        <Input
          name="username"
          control={control}
          placeholder="seu-usuario"
          hasPrefix
        />

        {errors.username && (
          <FormError size="sm">{errors.username.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Nome completo</Text>
        <Input
          name="name"
          control={control}
          placeholder="Seu nome"
          hasPrefix={false}
        />

        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <Button type="submit" disabled={isSubmitting}>
        Próximo passo
        <ArrowRight />
      </Button>
    </Form>
  );
}
