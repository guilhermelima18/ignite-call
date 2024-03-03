import Head from "next/head";
import { Heading, MultiStep, Text } from "@ignite-ui/react";
import { RegisterForm } from "./components/register-form";
import { Container, Header } from "./styles";

export default function Register() {
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

        <MultiStep size={4} currentStep={1} />
      </Header>

      <RegisterForm />
    </Container>
  );
}
