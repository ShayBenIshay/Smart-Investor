import Menu from "@/components/menu/Menu";
import "../../styles/global.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="adminContainer">
      <div className="menuContainer">
        <Menu />
      </div>
      <div className="contentContainer">{children}</div>
    </div>
  );
}
