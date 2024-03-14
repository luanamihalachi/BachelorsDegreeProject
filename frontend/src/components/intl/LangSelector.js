import { useContext } from "react";
import { Context } from "../intl/Wrapper";

function LangSelector(props) {
  const context = useContext(Context);
  return (
    <>
      <select
        style={{
          padding: "8px 20px 8px 8px",
          fontSize: "14px",
          borderRadius: "4px",
          appearance: "none",
          backgroundSize: "16px",
          paddingRight: "15px",
          border: "none",
          color: "#001529",
        }}
        value={context.locale}
        onChange={context.selectLang}
      >
        <option value={"ro-RO"}>Română</option>
        <option value={"en-US"}>English</option>
      </select>
    </>
  );
}

export default LangSelector;
