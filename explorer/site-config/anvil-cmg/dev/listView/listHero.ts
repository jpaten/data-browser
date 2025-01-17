import {
  ComponentConfig,
  ComponentsConfig,
} from "@clevercanary/data-explorer-ui/lib/config/entities";
import * as C from "../../../../app/components";
import * as V from "../../../../app/viewModelBuilders/azul/anvil-cmg/common/viewModelBuilders";

export const listHero: ComponentsConfig = [
  {
    component: C.Alert,
    viewBuilder: V.buildListWarning,
  } as ComponentConfig<typeof C.Alert>,
];
