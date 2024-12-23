import SquareLoader from "react-spinners/SquareLoader";

const Loading = () => {
  return (
    <div className="flex flex-col w-full h-96 justify-center items-center">
      <SquareLoader color="#4F46E5" />
    </div>
  );
};

export default Loading;