import { useRouter } from "next/router";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight, Check } from "phosphor-react";
import { Container, Header } from "../styles";
import { AuthError, ConnectBox, ConnectItem } from "./styles";

export default function ConnectCalendar() {
  const { status, data } = useSession();
  const router = useRouter();

  console.log(data);

  const hasAuthError = !!router.query?.error;
  const hasSignedIn = status === "unauthenticated";

  async function handleSignIn() {
    await signIn("google");
  }

  return (
    <Container>
      <Head>
        <title>{`${
          hasSignedIn ? "Conectar calendário" : "Conectado ao calendário"
        } - Ignite Call`}</title>
      </Head>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {!hasSignedIn ? (
            <Button size="sm" disabled>
              Conectado <Check />
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleSignIn}>
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button type="submit" disabled={hasSignedIn}>
          Próximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}
