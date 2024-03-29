import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from "@ignite-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import { api } from "@/libs/axios";
import { FormAnnotation, ProfileBox } from "./styles";
import { Container, Header } from "../styles";

const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const router = useRouter();
  const session = useSession();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    const { bio } = data;

    try {
      await api.put("/users/profile", {
        bio,
      });

      await router.push(`/schedule/${session?.data?.user.username}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Head>
        <title>Registro - Ignite Call</title>
      </Head>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Foto de perfil</Text>
          <Avatar
            src={session.data?.user.avatar_url}
            alt={session.data?.user.name}
            referrerPolicy="no-referrer"
          />
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register("bio")} />
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Finalizar
        </Button>
      </ProfileBox>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  return {
    props: {
      session,
    },
  };
};
