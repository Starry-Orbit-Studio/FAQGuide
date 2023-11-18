import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { useCSSTransition } from "./usecsstransition.ts";
import { Board } from "./Board.tsx";
import "./app.css";
import dataUrl from "/data.yaml?url";
import logo from "/logo.png";
import YAML from "yaml";

const delay = (time: number) => new Promise((res) => setTimeout(res, time));

export const App = component$(() => {
  const data = useSignal<Data | undefined>(undefined);
  const root = useSignal<Data | undefined>(undefined);
  const goHome = useSignal(false);
  const onOff = useSignal(false);
  const { stage, shouldMount } = useCSSTransition(onOff, { timeout: 300 });

  useTask$(async () => {
    const res = await fetch(dataUrl);
    const text = await res.text();
    data.value = root.value = YAML.parse(text);
    goHome.value = false;
    onOff.value = true;
  });

  return (
    <>
      <div>
        <a href="https://starry-orbit-studio.github.io/docs/" target="_blank">
          <img src={logo} class="logo" alt="Extreme Starry logo" />
        </a>
      </div>
      <h1>Extreme Starry 疑难解答向导</h1>
      {shouldMount.value && (
        <div
          class="card"
          style={{
            transition: ".3s",
            opacity: stage.value === "enterTo" ? 1 : 0,
          }}
        >
          <Board
            data={data.value}
            goHomeVisible={goHome.value}
            onChoice$={(newData: Data) => {
              onOff.value = false;
              delay(300).then(() => {
                data.value = newData;
                goHome.value = true;
                onOff.value = true;
              });
            }}
            onGoHome$={() => {
              onOff.value = false;
              delay(300).then(() => {
                data.value = root.value;
                goHome.value = false;
                onOff.value = true;
              });
            }}
          />
        </div>
      )}
      <p class="read-the-docs">点击Logo了解更多</p>
    </>
  );
});
