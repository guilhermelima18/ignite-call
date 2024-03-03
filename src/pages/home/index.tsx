import Head from "next/head";
import Image from "next/image";
import { Heading, Text } from "@ignite-ui/react";
import { ClaimUsernameForm } from "./components/claim-username-form";

import previewImage from "../../assets/app-preview.png";
import { Container, Hero, Preview } from "./styles";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Início - Ignite Call</title>
      </Head>
      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento descomplicado
        </Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={previewImage}
          alt="Calendário simbolizando a aplicação em funcionamento."
          height={400}
          quality={100}
          priority
        />
      </Preview>
    </Container>
  );
}
