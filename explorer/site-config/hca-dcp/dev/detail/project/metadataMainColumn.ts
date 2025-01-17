import { ComponentConfig } from "@clevercanary/data-explorer-ui/lib/config/entities";
import * as C from "../../../../../app/components";

export const mainColumn: ComponentConfig[] = [
  {
    component: C.TitledText,
    viewBuilder: () => ({
      text: ["To do."],
      title: "Metadata Download",
    }),
  } as ComponentConfig<typeof C.TitledText>,
];
