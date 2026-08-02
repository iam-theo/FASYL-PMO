import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FasylLogo from "../../assets/FasylLogo.svg";

function DashboardIcon({ active }) {
  const color = active ? "#1B3C4A" : "#000000";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.35139 13.2135C1.99837 10.9162 1.82186 9.76763 2.25617 8.74938C2.69047 7.73112 3.65403 7.03443 5.58114 5.64106L7.02099 4.6C9.41829 2.86667 10.6169 2 12 2C13.3831 2 14.5817 2.86667 16.979 4.6L18.4189 5.64106C20.346 7.03443 21.3095 7.73112 21.7438 8.74938C22.1781 9.76763 22.0016 10.9162 21.6486 13.2135L21.3476 15.1724C20.8471 18.4289 20.5969 20.0572 19.429 21.0286C18.2611 22 16.5537 22 13.1388 22H10.8612C7.44633 22 5.73891 22 4.571 21.0286C3.40309 20.0572 3.15287 18.4289 2.65243 15.1724L2.35139 13.2135Z"
        fill={color}
        fillOpacity={active ? "0.3" : "0"}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 18H14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectsIcon({ active }) {
  const color = active ? "#1B3C4A" : "#000000";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0065 21.0001H9.60546C6.02021 21.0001 4.22759 21.0001 3.11379 19.8652C2 18.7302 2 16.9035 2 13.2501C2 9.59674 2 7.77004 3.11379 6.63508C4.22759 5.50012 6.02021 5.50012 9.60546 5.50012H13.4082C16.9934 5.50012 18.7861 5.50012 19.8999 6.63508C20.7568 7.50831 20.9544 8.79102 21 11.0001"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17.111 13.2551C17.2956 13.085 17.3879 13 17.5 13C17.6121 13 17.7044 13.085 17.889 13.2551L18.6017 13.9117C18.6878 13.991 18.7308 14.0307 18.7843 14.0503C18.8378 14.07 18.8963 14.0677 19.0133 14.0631L19.9762 14.0253C20.2241 14.0155 20.3481 14.0107 20.4331 14.0821C20.5181 14.1535 20.5346 14.2765 20.5677 14.5224L20.7004 15.5077C20.7157 15.6216 20.7234 15.6785 20.7511 15.7271C20.7789 15.7757 20.824 15.8112 20.9143 15.8823L21.6898 16.4928C21.8817 16.6439 21.9777 16.7194 21.9967 16.8274C22.0157 16.9354 21.9513 17.0391 21.8225 17.2467L21.2965 18.0943C21.2363 18.1913 21.2063 18.2398 21.1967 18.2946C21.1871 18.3493 21.199 18.4052 21.2228 18.5168L21.4315 19.4952C21.4827 19.7356 21.5084 19.8558 21.4533 19.9513C21.3983 20.0467 21.2814 20.0848 21.0477 20.1609L20.122 20.4624C20.0117 20.4983 19.9565 20.5163 19.9134 20.5528C19.8703 20.5894 19.8436 20.6409 19.7902 20.7439L19.338 21.6154C19.2227 21.8375 19.1651 21.9485 19.0601 21.9868C18.9551 22.0251 18.8395 21.9772 18.6084 21.8813L17.72 21.5128C17.6114 21.4678 17.5572 21.4453 17.5 21.4453C17.4428 21.4453 17.3886 21.4678 17.28 21.5128L16.3916 21.8813C16.1605 21.9772 16.0449 22.0251 15.9399 21.9868C15.8349 21.9485 15.7773 21.8375 15.662 21.6154L15.2098 20.7439C15.1564 20.6409 15.1297 20.5894 15.0866 20.5528C15.0435 20.5163 14.9883 20.4983 14.878 20.4624L13.9523 20.1609C13.7186 20.0848 13.6017 20.0467 13.5467 19.9513C13.4916 19.8558 13.5173 19.7356 13.5685 19.4952L13.7772 18.5168C13.801 18.4052 13.8129 18.3493 13.8033 18.2946C13.7937 18.2398 13.7637 18.1913 13.7035 18.0943L13.1775 17.2467C13.0487 17.0391 12.9843 16.9354 13.0033 16.8274C13.0223 16.7194 13.1183 16.6439 13.3102 16.4928L14.0857 15.8823C14.176 15.8112 14.2211 15.7757 14.2489 15.7271C14.2766 15.6785 14.2843 15.6216 14.2996 15.5077L14.4323 14.5224C14.4654 14.2765 14.4819 14.1535 14.5669 14.0821C14.6519 14.0107 14.7759 14.0155 15.0238 14.0253L15.9867 14.0631C16.1037 14.0677 16.1622 14.07 16.2157 14.0503C16.2692 14.0307 16.3122 13.991 16.3983 13.9117L17.111 13.2551Z"
        fill={color}
        fillOpacity={active ? "0.3" : "0.05"}
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M15.9998 5.5L15.9004 5.19094C15.4054 3.65089 15.1579 2.88087 14.5686 2.44043C13.9794 2 13.1967 2 11.6313 2H11.3682C9.8028 2 9.02011 2 8.43087 2.44043C7.84162 2.88087 7.59411 3.65089 7.0991 5.19094L6.99976 5.5"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ReportsIcon({ active }) {
  const color = active ? "#1B3C4A" : "#000000";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10.5C3 6.72876 3 4.84315 4.17157 3.67157C5.34315 2.5 7.22876 2.5 11 2.5H13C16.7712 2.5 18.6569 2.5 19.8284 3.67157C21 4.84315 21 6.72876 21 10.5V13.5C21 17.2712 21 19.1569 19.8284 20.3284C18.6569 21.5 16.7712 21.5 13 21.5H11C7.22876 21.5 5.34315 21.5 4.17157 20.3284C3 19.1569 3 17.2712 3 13.5V10.5Z"
        fill={color}
        fillOpacity={active ? "0.3" : "0"}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 16.5V11.5M12 16.5V8.5M16 16.5V13.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 12C2.5 7.52166 2.5 5.28248 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28248 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1087C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1087C2.5 18.7175 2.5 16.4783 2.5 12Z"
        fill="#D20019"
        fillOpacity="0.3"
        stroke="#D20019"
        strokeWidth="1.5"
      />
      <path
        d="M7.03662 12.0275H14.0122M14.0122 12.0275C14.0122 12.5979 11.857 14.5148 11.857 14.5148M14.0122 12.0275C14.0122 11.4421 11.857 9.5631 11.857 9.5631M17.0366 7.99512V15.9951"
        stroke="#D20019"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ pointsRight }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${pointsRight ? "" : "rotate-180"}`}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="#636363"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COLLAPSED_STORAGE_KEY = "pmo.sidebarCollapsed";

/** Width the content column must offset by. Published as a CSS variable. */
const EXPANDED_WIDTH = "19.44%";
const COLLAPSED_WIDTH = "5rem";

/**
 * The collapse TRIGGER lives in TopBar, not here — it is always visible there,
 * and the rail itself has no room for one at 80px. This component is therefore
 * controlled: `MainBody` owns `isCollapsed` and passes it to both. The internal
 * state below is only a fallback for rendering SideBar on its own.
 */
function SideBar({
  activeTab,
  setActiveTab,
  setOpenProject,
  handleLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  isCollapsed: controlledCollapsed,
  onCollapsedChange,
}) {
  // Uncontrolled by default, but a parent can lift the state if it ever needs
  // to (e.g. to persist per user rather than per browser).
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
  });

  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : uncontrolledCollapsed;

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    if (!isControlled) setUncontrolledCollapsed(next);
    onCollapsedChange?.(next);
    try {
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
    } catch {
      // Private browsing can refuse writes; the rail still works this session.
    }
  };

  /**
   * The content column offsets itself by this variable, so the rail owns its
   * own width and nothing has to hardcode a matching percentage.
   *
   * Mobile is unaffected: below lg the rail is an overlay drawer that sits on
   * top of the content rather than beside it.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--pmo-sidebar-width",
      isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
    );
    return () => root.style.removeProperty("--pmo-sidebar-width");
  }, [isCollapsed]);

  /**
   * Tooltip for the collapsed rail.
   *
   * Positioned in JS and rendered through a portal rather than as a CSS
   * `group-hover` sibling. An absolutely-positioned label inside the rail
   * depends on no ancestor clipping it and on the rail winning the stacking
   * order against the fixed header and the content column — conditions that
   * are easy to break and give no error when they do. Fixed coordinates on
   * document.body depend on nothing.
   */
  const [tooltip, setTooltip] = useState(null);

  const showTooltip = (event, label) => {
    // Only the collapsed rail needs labels; expanded rows already have them.
    if (!isCollapsed || window.innerWidth < 1024) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      label,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };

  const hideTooltip = () => setTooltip(null);

  // A stale tooltip after the rail expands or the user navigates looks broken.
  useEffect(() => {
    setTooltip(null);
  }, [isCollapsed]);

  const tooltipHandlers = (label) => ({
    onMouseEnter: (event) => showTooltip(event, label),
    onMouseLeave: hideTooltip,
    onFocus: (event) => showTooltip(event, label),
    onBlur: hideTooltip,
  });

  const tabs = [
    { name: "dashboard", label: "Dashboard" },
    { name: "projects", label: "Projects" },
    { name: "reports", label: "Reports" },
    // { name: "tasks", label: "Tasks"}
  ];

  const renderIcon = (name, isActive) => {
    if (name === "dashboard") return <DashboardIcon active={isActive} />;
    if (name === "projects") return <ProjectsIcon active={isActive} />;
    if (name === "reports") return <ReportsIcon active={isActive} />;
    return null;
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-1999 lg:hidden"
        />
      )}

      <div
        className={
          // Widths are scoped to their own breakpoint rather than overriding a
          // base `w-70`: two competing width utilities on one element is a
          // fight over source order, and the base was winning — the rail kept
          // its full width while the labels correctly disappeared.
          //
          // The drawer stays full width on mobile: collapsing a panel that is
          // already hidden behind a scrim only makes it harder to read.
          "max-lg:w-70 h-screen bg-[#FFFFFF] pb-4 fixed top-0 left-0 flex flex-col border-r-[1.5px] border-[#0000000D] z-2000 transition-[transform,width] duration-300 ease-in-out lg:translate-x-0 " +
          (isCollapsed ? "lg:w-20 " : "lg:w-[19.44%] ") +
          (isSidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div
          className={
            "flex items-center justify-between gap-3 border-b-[1.5px] border-[#0000000D] p-4 h-18 " +
            (isCollapsed ? "lg:justify-center lg:px-0" : "")
          }
        >
          {/*
            The mark stays at every width — it is the only branding in the rail.
            Only the wordmark hides, because 80px cannot hold it.
          */}
          <div className="flex items-center gap-3 min-w-0">
            <img src={FasylLogo} alt="Fasyl Logo" className="w-10 h-10 shrink-0" />
            <div className={"min-w-0 " + (isCollapsed ? "lg:hidden" : "")}>
              <p className="font-medium text-[14px]/[20px] text-[#090909] truncate">
                Fasyl PMO Portal
              </p>
              <p className="font-normal text-[14px]/[20px] text-[#636363]">PMO</p>
            </div>
          </div>

        </div>

        <nav
          aria-label="Main"
          className="flex flex-col items-start justify-between p-4 pb-4 h-full"
        >
          <div className="w-full flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  type="button"
                  // The visible label disappears when collapsed, so the name has
                  // to come from somewhere a screen reader can still reach.
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                  {...tooltipHandlers(tab.label)}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setOpenProject(false);
                    setIsSidebarOpen(false);
                  }}
                  className={`group relative w-full py-2 px-3 flex items-center gap-3 rounded-md cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B3C4A] ${
                    isCollapsed ? "lg:justify-center lg:px-0" : ""
                  } ${
                    isActive
                      ? "bg-[#0000000D] text-[#1B3C4A]"
                      : "text-[#000000] hover:bg-[#0000000D] hover:text-[#1B3C4A]"
                  }`}
                >
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full">
                    {renderIcon(tab.name, isActive)}
                  </div>
                  <p
                    className={
                      "font-medium text-[16px]/[24px] truncate " +
                      (isCollapsed ? "lg:hidden" : "")
                    }
                  >
                    {tab.label}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            {...tooltipHandlers("Logout")}
            className={`group relative w-full flex items-center gap-2 rounded-md py-2 px-3 cursor-pointer transition-colors hover:bg-[#D2001914] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D20019] ${
              isCollapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <span className="shrink-0">
              <LogoutIcon />
            </span>
            <p
              className={
                "font-medium text-[16px]/[24px] text-[#D20019] " +
                (isCollapsed ? "lg:hidden" : "")
              }
            >
              Logout
            </p>
          </button>
        </nav>
      </div>

      {tooltip &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: tooltip.top,
              left: tooltip.left,
              transform: "translateY(-50%)",
            }}
            className="pointer-events-none z-[9999] whitespace-nowrap rounded-md bg-[#1B3C4A] px-3 py-1.5 font-medium text-[13px]/[18px] text-[#FFFFFF] shadow-lg"
          >
            {tooltip.label}
          </div>,
          document.body,
        )}
    </>
  );
}

export default SideBar;
