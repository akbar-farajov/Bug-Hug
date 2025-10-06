import { TreeItem } from "@/types";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "./ui/sidebar";

interface TreeViewProps {
  data: TreeItem[];
  value: string;
  onValueChange: (value: string) => void;
}

export const TreeView: FC<TreeViewProps> = ({ data, value, onValueChange }) => {
  return (
    <SidebarProvider>
      <Sidebar className="w-full h-full" collapsible="none">
        <SidebarContent className="h-full">
          <SidebarGroup>
            <SidebarGroupContent className="h-full">
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onValueChange}
                    parentPath=""
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

interface TreeProps {
  item: TreeItem;
  selectedValue: string;
  onSelect: (value: string) => void;
  parentPath: string;
}

export const Tree: FC<TreeProps> = ({
  item,
  selectedValue,
  onSelect,
  parentPath,
}) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const path = parentPath ? `${parentPath}/${name}` : name;

  if (!items.length) {
    const isSelected = selectedValue === path;

    return (
      <SidebarMenuButton
        isActive={isSelected}
        onClick={() => onSelect?.(path)}
        className="data-[active=true]:bg-transparent"
      >
        <FileIcon />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    );
  }
  return (
    <Collapsible
      className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      defaultOpen
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton>
          <ChevronRightIcon className="transition-transform duration-200" />
          <FolderIcon />
          <span className="truncate">{name}</span>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {items.map((item, index) => (
            <Tree
              key={index}
              item={item}
              selectedValue={selectedValue}
              onSelect={onSelect}
              parentPath={path}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};
