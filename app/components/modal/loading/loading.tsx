import { ProgressSpinner } from "primereact/progressspinner";
import './loading.css';

const Loading = () => {
  return (
    <div className="loadingScreen">
      <div>
        <ProgressSpinner
          style={{ width: "25px", height: "25px"}}
          strokeWidth="2"
          animationDuration=".5s"
        />
        <strong className="LoadingText">Loading</strong>
      </div>
    </div>
  );
};

export default Loading;
