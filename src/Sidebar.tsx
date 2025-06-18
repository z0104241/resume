import React from "react";
import type { MenuItem, SelectedMenu } from "./types";


interface SidebarProps {
  menu: MenuItem[];
  selected: SelectedMenu;
  onSelect: (s: SelectedMenu) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menu, selected, onSelect }) => (
  <div className="sidebar">
    {menu.map((item, idx) => (
      <div key={item.title}>
        <div
          className={`sidebar-item ${selected.idx === idx && selected.detail === null ? "active" : ""}`}
          onClick={() => onSelect({ idx, detail: null })}
        >
          {item.title}
        </div>
        {selected.idx === idx &&
          item.details.map((d, dIdx) => (
            <div
              key={d}
              className={`sidebar-detail ${selected.detail === dIdx ? "active" : ""}`}
              onClick={() => onSelect({ idx, detail: dIdx })}
            >
              {d}
            </div>
          ))}
      </div>
    ))}
  </div>
);

export default Sidebar;
