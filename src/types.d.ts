interface Data {
  title: string;
  choices: Record<string, Data>;
}

interface BoardProps {
  data?: Data | string;
  goHomeVisible: boolean;
  onChoice$: (data: Data) => void;
  onGoHome$: () => void;
}