"use client";

import "./Menu.scss";
import { menu } from "../../data";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Menu = () => {
  const router = useRouter();

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <button
              className="listItem"
              key={listItem.id}
              onClick={() => handleNavigation(listItem.url)}
            >
              <Image src={listItem.icon} alt="" width={20} height={20} />
              <span className="listItemTitle">{listItem.title}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
