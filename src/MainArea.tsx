import React from "react";
import type { MenuItem, SelectedMenu } from "./types";


interface MainAreaProps {
  menu: MenuItem[];
  selected: SelectedMenu;
}

const MainArea: React.FC<MainAreaProps> = ({ menu, selected }) => {
  const item = menu[selected.idx];
  if (!item) return null;

  return (
    <div className="main-content">
      {selected.detail !== null ? (
        <div>
          <h2>{item.details[selected.detail]}</h2>
          <div className="main-detail">이곳에 상세내용이 나옵니다.</div>
        </div>
      ) : (
        <h1>{item.title}</h1>
      )}
    </div>
  );
};

export default MainArea;
