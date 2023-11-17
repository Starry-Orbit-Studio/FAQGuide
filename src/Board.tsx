import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { remark } from "remark";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

const mdProcessor = remark()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

export const Board = component$<BoardProps>((props: BoardProps) => {
  const goHome = <button onClick$={() => props.onGoHome$()}>返回首页</button>;
  if (!props.data)
    return (
      <>
        <h2>暂无解决方案</h2>
        {goHome}
      </>
    );

  if (typeof props.data === "string") {
    const html = useSignal("");
    const markdown = props.data;
    useVisibleTask$(async () => {
      html.value = String(await mdProcessor.process(markdown));
    });

    return (
      <>
        <article dangerouslySetInnerHTML={html.value} />
        {goHome}
      </>
    );
  }

  return (
    <>
      <h2>{props.data.title}</h2>

      <div class="list">
        {Object.entries(props.data?.choices ?? {}).map(([choice, data]) => (
          <button key={choice} onClick$={() => props.onChoice$(data)}>
            {choice}
          </button>
        ))}

        {props.goHomeVisible && goHome}
      </div>
    </>
  );
});
