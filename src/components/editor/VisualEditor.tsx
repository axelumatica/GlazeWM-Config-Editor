import { useCallback } from "react";
import type { GlazeConfig, GeneralConfig, GapsConfig, FocusBordersConfig } from "@/types";
import { stringifyYaml } from "@/lib/yaml-utils";
import { GeneralSection } from "./sections/GeneralSection";
import { GapsSection } from "./sections/GapsSection";
import { FocusBordersSection } from "./sections/FocusBordersSection";
import { WorkspacesSection } from "./sections/WorkspacesSection";
import { KeybindingsSection } from "./sections/KeybindingsSection";
import { WindowRulesSection } from "./sections/WindowRulesSection";

interface Props {
  config: GlazeConfig;
  onYamlChange: (yaml: string) => void;
}

export function VisualEditor({ config, onYamlChange }: Props) {
  const updateConfig = useCallback(
    (updated: GlazeConfig) => {
      onYamlChange(stringifyYaml(updated));
    },
    [onYamlChange]
  );

  const updateGeneral = useCallback(
    (general: GeneralConfig) => updateConfig({ ...config, general }),
    [config, updateConfig]
  );

  const updateGaps = useCallback(
    (gaps: GapsConfig) => updateConfig({ ...config, gaps }),
    [config, updateConfig]
  );

  const updateFocusBorders = useCallback(
    (focusBorders: FocusBordersConfig) =>
      updateConfig({ ...config, focus_borders: focusBorders }),
    [config, updateConfig]
  );

  return (
    <div className="h-full overflow-y-auto px-6 py-4 space-y-2">
      <GeneralSection
        config={config.general ?? {}}
        onChange={updateGeneral}
      />
      <GapsSection
        config={config.gaps ?? {}}
        onChange={updateGaps}
      />
      <FocusBordersSection
        config={config.focus_borders ?? {}}
        onChange={updateFocusBorders}
      />
      <WorkspacesSection
        workspaces={config.workspaces ?? []}
        onChange={(ws) => updateConfig({ ...config, workspaces: ws })}
      />
      <KeybindingsSection
        keybindings={config.keybindings ?? []}
        onChange={(kb) => updateConfig({ ...config, keybindings: kb })}
      />
      <WindowRulesSection
        rules={config.window_rules ?? []}
        onChange={(r) => updateConfig({ ...config, window_rules: r })}
      />
    </div>
  );
}
