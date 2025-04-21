import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function LoginPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to the Photo App</h2>
      <p>Please sign in to continue</p>
    </div>
  );
}

export default withAuthenticator(LoginPage);
