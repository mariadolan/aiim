import Bar from "./Bar";
const Footer = () => {
  return (
    <>
      <div className="pt-10" />
      <Bar />
      <div className="px-page">
        <img
          src="/logo.png"
          alt="AIIM"
          className="object-cover aspect-[2/1] h-16"
        />
      </div>
      <Bar />
      <div className="flex justify-center items-center p-3">
        <h1>AIIM Research © 2024 - All Rights Reserved.</h1>
      </div>
    </>
  );
};

export default Footer;
