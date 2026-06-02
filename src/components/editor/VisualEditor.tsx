import { useCallback } from "react";
import type {
  GlazeConfig,
  GeneralConfig,
  GapsConfig,
  WindowEffectsConfig,
  WindowBehaviorConfig,
} from "@/types";
import { stringifyYaml } from "@/lib/yaml-utils";
import { GeneralSection } from "./sections/GeneralSection";
import { GapsSection } from "./sections/GapsSection";
import { WindowEffectsSection } from "./sections/WindowEffectsSection";
import { WindowBehaviorSection } from "./sections/WindowBehaviorSection";
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

  const updateWindowEffects = useCallback(
    (window_effects: WindowEffectsConfig) => updateConfig({ ...config, window_effects }),
    [config, updateConfig]
  );

  const updateWindowBehavior = useCallback(
    (window_behavior: WindowBehaviorConfig) => updateConfig({ ...config, window_behavior }),
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
      <WindowEffectsSection
        config={config.window_effects ?? {}}
        onChange={updateWindowEffects}
      />
      <WindowBehaviorSection
        config={config.window_behavior ?? {}}
        onChange={updateWindowBehavior}
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
