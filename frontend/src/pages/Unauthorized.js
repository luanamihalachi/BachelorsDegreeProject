import { FormattedMessage } from "react-intl";

function UnauthorizedPage() {
  return (
    <>
      <h1>
        <FormattedMessage
          id="app.unauthorized"
          defaultMessage={"You are not authorized to view this page!"}
        />
      </h1>
    </>
  );
}
export default UnauthorizedPage;
