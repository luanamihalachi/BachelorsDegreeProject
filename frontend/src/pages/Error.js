import { FormattedMessage } from "react-intl";

function ErrorPage() {
  return (
    <>
      <h1>
        <FormattedMessage
          id="app.error404"
          defaultMessage={"Page doesn't exist!"}
        />
      </h1>
    </>
  );
}
export default ErrorPage;
