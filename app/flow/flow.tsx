import { Dropdown } from "primereact/dropdown";
import "./flow.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FlowInterface } from "../interfaces/FlowInterface";

const Flow = ({ header, apiUrl, logged, selectedFlow}) => {
  const [flow, setFlow] = useState(null);
  const [flowList, setFlowList] = useState<FlowInterface[]>([]);
  const [flowsNames, setFlowsNames] = useState<String[]>([]);

  let onNothing = ["No flow found"];

  useEffect(() => {
    if (logged) {
      getFlows();
    }
  }, [logged]);

  useEffect(() => {
    setFlowNameList();
  }, [flowList]);

  useEffect(() => {
    selectedFlow(flowList.find(obj => obj.name === flow));
  }, [flow])

  function setFlowNameList() {
    const names = flowList.map((flow) => flow?.name ?? "");
    setFlowsNames(names);
  }

  async function getFlows() {
    await axios({
      method: "get",
      url: apiUrl + "portal-service/flows",
      headers: header,
    }).then((response) => {
      setFlowList(response.data);
    }).catch((error) => {
      sessionStorage.removeItem("profile_data")
      window.location.reload()
    });
  }

  return (
    <>
      <div className="flowContainer">
        <p>Select Flow ID</p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Dropdown
            value={flow}
            options={flowsNames.length > 0 ? flowsNames : onNothing}
            onChange={(e) => setFlow(e.value)}
            placeholder="Select one flow"
          />
          <button onClick={() => getFlows()}> update </button>
        </div>
      </div>
    </>
  );
};

export default Flow;