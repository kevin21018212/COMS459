import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RedirectAfterLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}

function LoginPage() {
  return (
    <Authenticator
      loginMechanisms={["email"]}
      signUpAttributes={["email"]}
      socialProviders={[]}
      hideSignUp={false}
      variation="default"
    >
      <RedirectAfterLogin />
    </Authenticator>
  );
}

export default LoginPage;
