import { LoginForm } from "@/components/auth/LoginForm";
import { DUMMY_USERS } from "@/data/users";

const LoginPage = () => {
  return (
    <LoginForm users={DUMMY_USERS} forgotPasswordPath="/forgot-password" />
  );
};

export default LoginPage;
