import React from "react";
import type { MenuItem, SelectedMenu } from "./types.tsx";


interface MainAreaProps {
  menu: MenuItem[];
  selected: SelectedMenu;
}

const MainArea: React.FC<MainAreaProps> = ({ menu, selected }) => {
  const item = menu[selected.idx];
  if (!item) return null;
  const detailItem = selected.detail !== null ? item.details?.[selected.detail] : null;

  return (
    <div className="main-content">
      {detailItem ? (
        <div>
          {/* 객체가 아닌, 객체의 'label'과 'content' 속성을 렌더링 */}
          <h2>{detailItem.label}</h2>
          <div className="main-detail">{detailItem.content}</div>
        </div>
      ) : (
        <h1>{item.title}</h1>
      )}
    </div>
  );
};

export default MainArea;
