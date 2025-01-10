
import { Dropdown } from "primereact/dropdown"
import "./flow.css"
import { useState } from "react";


const Flow = () => {

    const [flow, setFlow] = useState(null); 
    const flowList = [
        "flow1","flo2","flo4"
    ]

    return (
        <>
            <div className="flowContainer">
                <p>Select Flow ID</p>
                <Dropdown value={flow} options={flowList} onChange={(e) => setFlow(e.value)} placeholder="Select one flow"/>
            </div>
        </>
    )

}

export default Flow