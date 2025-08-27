import ButtonGroup from "./inputs/ButtonGroup";

type ToolbarProps = {
  activeTab: "calendar" | "finals" | "list";
  onTabChange: (tab: "calendar" | "finals" | "list") => void;
};

const Toolbar = ({ activeTab, onTabChange }: ToolbarProps) => {
  return (
    <div className="flex justify-between">
      <ButtonGroup
        className="flex"
        buttons={[
          {
            label: "Calendar",
            active: activeTab === "calendar",
            onClick: () => {
              onTabChange("calendar");
            },
          },
          {
            label: "Finals",
            active: activeTab === "finals",
            onClick: () => {
              onTabChange("finals");
            },
          },
          {
            label: "List",
            active: activeTab === "list",
            onClick: () => {
              onTabChange("list");
            },
          },
        ]}
      />
    </div>
  );
};

export default Toolbar;
