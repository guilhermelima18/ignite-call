import { GetStaticPaths, GetStaticProps } from "next";
import { Avatar, Heading, Text } from "@ignite-ui/react";
import { prisma } from "@/libs/prisma";
import { Container, UserHeader } from "./styles";

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

export default function Username({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} alt={user.name} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = params?.username as string;

  const userArray = await prisma.user.findMany({
    where: {
      username,
    },
    select: {
      name: true,
      bio: true,
      avatar_url: true,
    },
  });

  if (!userArray.length) {
    return {
      notFound: true,
    };
  }

  const user = userArray[0];

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};
