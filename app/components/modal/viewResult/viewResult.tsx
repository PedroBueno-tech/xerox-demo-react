import { useState } from "react";
import './viewResult.css'

const ViewResult = ({ item, setModal }) => {

    const [logs, setLogs] = useState(false);
    const [more, setMore] = useState(false);
    const [attributes, setAttributes] = useState(false);
    const [audit, setAudit] = useState(false);

    if (!item) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h5>Document: {item?.code ?? "No type"}</h5>
                <div>
                    <label>Fields:</label>
                    <ul>
                        <li>Guid: {item?.guid ?? "No guid"}</li>
                        <li>Dossier: {item?.dossier ?? "No dossier"}</li>
                        <li>Name: {item?.name ?? "No name"}</li>
                        <li>
                            Attributes:
                            <ul>
                                {
                                    item?.attributes?.map((attribute: any) => (
                                        <li key={attribute.id}> {attribute?.name ?? "No name"}: {attribute?.value ?? "No value"} </li>
                                    ))
                                }

                            </ul>
                        </li>
                        <li>Status: {item?.status ?? "No status"}</li>
                        <li>Message: {item?.message ?? "No message"}</li>
                        <li>
                            LOGS:
                            <button onClick={() => setLogs(!logs)}>Show</button>
                            {logs ? (
                                item?.logs && item.logs.length > 0 ? (
                                    <ul>
                                        {item.logs.map((log: any, index: number) => (
                                            <li key={log.id || index}>
                                                Status: {log?.statusNew ?? "No status"}, Step: {log?.stepNew ?? "No Step"}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul>
                                        <li key="no-logs">No logs to show</li>
                                    </ul>
                                )
                            ) : null}
                        </li>

                        <li>
                            Details:
                            <button onClick={() => setMore(!more)}>Show More</button>
                            {more && (
                                <ul>
                                    <li>File Name: {item?.fileName ?? "No file name"}</li>
                                    <li>
                                        Attributes:
                                        <button onClick={() => setAttributes(!attributes)}>Show</button>
                                        {attributes && (
                                            <AttributesList attributes={item.attributes} />
                                        )}
                                    </li>
                                    <li>Code: {item?.code ?? "No code"}</li>
                                    <li>Step: {item?.step ?? "No step"}</li>
                                    <li>
                                        Audit:
                                        <button onClick={() => setAudit(!audit)}>Show</button>
                                        {audit && (
                                            <ul>
                                                <li>Created By: {item?.audit.createdBy ?? "No Created By"}</li>
                                                <li>Created On: {item?.audit.createdOn ?? "No Created On"}</li>
                                                <li>Updated By: {item?.audit.updatedBy ?? "No Updated By"}</li>
                                                <li>Updated On: {item?.audit.updatedOn ?? "No Updated On"}</li>
                                            </ul>
                                        )}
                                    </li>
                                    <li>Complementation ID: {item?.complementationId ?? "No complementation ID"}</li>
                                    <li>Default Score: {item?.defaultScore ?? "No default score"}</li>
                                    <li>Description: {item?.description ?? "No description"}</li>
                                    <li>Document Type Code: {item?.documentTypeCode ?? "No document type code"}</li>
                                    <li>Document Type List ID: {item?.documentTypeListId ?? "No document type list ID"}</li>
                                    <li>ID: {item?.id ?? "No ID"}</li>
                                    <li>Match: {item?.match ?? "No match"}</li>
                                    <li>Score: {item?.score ?? "No score"}</li>
                                    <li>Tags: {item?.tags ?? "No tags"}</li>
                                    <li>Typify ID: {item?.typifyId ?? "No tipify ID"}</li>
                                    <li>Validation ID: {item?.validationId ?? "No validation ID"}</li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                <div className="buttonsDiv">
                    <button onClick={() => setModal(false)}>Close</button>
                </div>
            </div>
        </div>
    );

}
export default ViewResult;


//componente de attributo com lógica separada
const AttributesList = ({ attributes }: { attributes: any[] }) => (
    <ul>
        {attributes && attributes.length > 0 ? (
            attributes.map((attribute: any) => (
                <li key={attribute.id}>
                    Attribute: {attribute.name}
                    <ul>
                        <li>Value: {attribute.value}</li>
                        <li>ID: {attribute.id}</li>
                        <li>Code: {attribute.code}</li>
                        <li>Score: {attribute.score}</li>
                        <li>Default score: {attribute.defaultScore}</li>
                        <li>Message: {attribute.message}</li>
                    </ul>
                </li>
            ))
        ) : (
            <ul>
                <li>No attributes to show</li>
            </ul>
        )}
    </ul>
);