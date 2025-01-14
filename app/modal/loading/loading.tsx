import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
  return (
    <div className="loadingScreen">
      <div>
        <ProgressSpinner
          style={{ width: "25px", height: "25px" }}
          strokeWidth="2"
          animationDuration=".5s"
        />
        <p>Loading</p>
      </div>
    </div>
  );
};

export default Loading;
