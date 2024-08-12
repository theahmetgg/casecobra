import Confetti from "react-dom-confetti";

const DesignPreview = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti active />
      </div>
    </>
  );
};

export default DesignPreview;
