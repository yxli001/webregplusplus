import ButtonGroup from "@/components/ButtonGroup";
import Book from "@/icons/Book";
import Preferences from "@/icons/Preferences";

export default function Home() {
  return (
    <div>
      <ButtonGroup
        buttons={[
          {
            label: "Calendar",
            active: true,
          },
          {
            label: "Finals",
          },
          {
            label: "List",
          },
        ]}
      />
      <ButtonGroup
        buttons={[
          {
            label: "Added",
            active: true,
            icon: Book,
          },
          {
            label: "Preferences",
            icon: Preferences,
          },
        ]}
      />
    </div>
  );
}
