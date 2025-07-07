import { Book, Trash2 } from "lucide-react";

import ThreePane from "@/components/v2/ThreePane";
import Dropdown from "@/components/v2/dropdown/Dropdown";
import CenterPlaceholder from "@/components/v2/placeholders/CenterPlaceholder";
import RightPlaceholder from "@/components/v2/placeholders/RightPlaceholder";
export default function Home() {
  return (
    <ThreePane
      left={
        <>
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<Book size={16} />}
            actions={<Trash2 size={16} />}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<Book size={16} />}
            actions={<Trash2 size={16} />}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
          <Dropdown
            value="cogs1"
            title="Cogs 1"
            icon={<Book size={16} />}
            actions={<Trash2 size={16} />}
            defaultOpen
          >
            <div>test</div>
          </Dropdown>
        </>
      }
      center={<CenterPlaceholder />}
      right={<RightPlaceholder />}
    />
  );
}
