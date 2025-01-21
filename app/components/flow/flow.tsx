import { Dropdown } from "primereact/dropdown";
import "./flow.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FlowInterface } from "../interfaces/FlowInterface";
import { Button } from "primereact/button";

const Flow = ({ header, apiUrl, logged, selectedFlow }) => {
  const [flow, setFlow] = useState(null);
  const [flowList, setFlowList] = useState<FlowInterface[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
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
    selectedFlow(flowList.find((obj) => obj.name === flow));
  }, [flow]);

  function setFlowNameList() {
    const names = flowList.map((flow) => flow?.name ?? "");
    setFlowsNames(names);
  }

  async function getFlows() {
    await axios({
      method: "get",
      url: apiUrl + "portal-service/flows",
      headers: header,
    })
      .then((response) => {
        setFlowList(response.data);
      })
      .catch((error) => {
        sessionStorage.removeItem("profile_data");
        window.location.reload();
      });
  }

  return (
    <>
      <div className="flowContainer">
        <strong>Select Flow ID</strong>
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <div>
          <Dropdown
            style={{width: "400px" }}
            value={flow}
            options={flowsNames.length > 0 ? flowsNames : onNothing}
            onChange={(e) => setFlow(e.value)}
            placeholder="Select one flow"
          />
          </div>
          <div className="ButtonDiv">
          <Button onClick={() => getFlows()} icon="pi pi-refresh" severity="danger" rounded />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Flow;
