import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { UnauthorizedError } from "../api";
import { Loader } from "../components/Loader";
import { useAuthentication } from "../helpers/authentication";
import { useLoginUser } from "../queries/user";

type SearchParams = {
  redirect?: string;
};

function renderError(error: Error) {
  if (error instanceof UnauthorizedError) {
    return <FormErrorMessage>Wrong credentials</FormErrorMessage>;
  }
  return <FormErrorMessage>An unknown error occured, please try again later</FormErrorMessage>;
}

interface Form {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { redirect } = Route.useSearch();
  const { state } = useAuthentication();
  const { mutate: loginUser, isPending, error } = useLoginUser();
  const { register, handleSubmit } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = async (data) => {
    // FIXME: Handle errors
    loginUser(data);
  };

  if (state.isAuthenticated) {
    return <Navigate to={redirect ?? "/"} />;
  }

  return (
    <Flex height="full" width="full" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        bgGradient="linear(to-br, cyan.100, cyan.200)"
        p={8}
        borderRadius={16}
      >
        <Heading as="h2" size="md" textAlign="center" mb={4}>
          Login
        </Heading>
        <Text textAlign="center" mb={4}>
          Welcome back! 👋
          <br />
          Please enter your credentials.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              bg="white"
              size="sm"
              {...register("username")}
            />
          </FormControl>
          <FormControl isInvalid={error !== null}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              bg="white"
              size="sm"
              {...register("password")}
            />
            {error !== null && renderError(error)}
          </FormControl>
          <Button
            color="white"
            colorScheme="cyan"
            mt={4}
            size="sm"
            type="submit"
            width="full"
            isLoading={isPending}
          >
            Login
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export const Route = createFileRoute("/login")({
  validateSearch: (search): SearchParams => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
  component: LoginPage,
  pendingComponent: Loader,
});
