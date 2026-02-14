import Button1 from "./UI/Button1";
import GameLogo from "./UI/GameLogo";

export default function Home() {
  return (
    <div className="">
      <GameLogo />
      <Button1 />
      <h1
        style={{ fontFamily: "var(--font-luckiest)" }}
        className="text-4xl  text-black"
      >
        Hello World
      </h1>
    </div>
  );
}
