import { TamaguiProvider, Heading } from "tamagui";

import tamaguiConfig from "../tamagui.config";

export const App = () => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Heading>Hello</Heading>
    </TamaguiProvider>
  );
};
