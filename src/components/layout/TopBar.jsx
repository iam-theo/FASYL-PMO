import { useEffect, useState } from "react";

function CollapseIcon({ pointsRight }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${pointsRight ? "" : "rotate-180"}`}
    >
      <path
        d="M3 10.5C3 6.72876 3 4.84315 4.17157 3.67157C5.34315 2.5 7.22876 2.5 11 2.5H13C16.7712 2.5 18.6569 2.5 19.8284 3.67157C21 4.84315 21 6.72876 21 10.5V13.5C21 17.2712 21 19.1569 19.8284 20.3284C18.6569 21.5 16.7712 21.5 13 21.5H11C7.22876 21.5 5.34315 21.5 4.17157 20.3284C3 19.1569 3 17.2712 3 13.5V10.5Z"
        stroke="#636363"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 2.5V21.5"
        stroke="#636363"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.52992 14.394C2.31727 15.7471 3.268 16.6862 4.43205 17.1542C8.89481 18.9486 15.1052 18.9486 19.5679 17.1542C20.732 16.6862 21.6827 15.7471 21.4701 14.394C21.3394 13.5625 20.6932 12.8701 20.2144 12.194C19.5873 11.2975 19.525 10.3197 19.5249 9.27941C19.5249 5.2591 16.1559 2 12 2C7.84413 2 4.47513 5.2591 4.47513 9.27941C4.47503 10.3197 4.41272 11.2975 3.78561 12.194C3.30684 12.8701 2.66061 13.5625 2.52992 14.394Z"
        fill="#228CEE"
        fillOpacity="0.3"
        stroke="#228CEE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21C9.79613 21.6219 10.8475 22 12 22C13.1525 22 14.2039 21.6219 15 21"
        stroke="#228CEE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The app header, shared by MainSection and the Reports shell.
 *
 * Extracted so the two cannot drift: reports previously rendered with no header
 * at all, which made switching to that tab feel like leaving the application.
 */
/** True at lg and up, where the rail sits beside the content rather than over it. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = (event) => setIsDesktop(event.matches);
    setIsDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function TopBar({
  user,
  setIsSidebarOpen,
  isSidebarOpen = false,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
}) {
  const isDesktop = useIsDesktop();

  /**
   * One control for the sidebar at every width. On desktop it collapses the
   * rail to icons; on mobile, where the rail is an overlay, it opens and closes
   * the drawer — which is what the hamburger used to do, so this replaces it.
   *
   * Rendered unconditionally on purpose. It used to be gated on the presence of
   * its handler, which meant forgetting to pass one made the button vanish with
   * no error to explain why.
   */
  const handleSidebarToggle = () => {
    if (!isDesktop) {
      setIsSidebarOpen?.((open) => !open);
      return;
    }
    if (onToggleSidebarCollapse) {
      onToggleSidebarCollapse();
    } else if (import.meta.env?.DEV) {
      console.warn(
        "[layout] TopBar is missing onToggleSidebarCollapse — the sidebar cannot collapse. Pass it from MainBody.",
      );
    }
  };

  const toggleLabel = !isDesktop
    ? isSidebarOpen
      ? "Close navigation"
      : "Open navigation"
    : isSidebarCollapsed
      ? "Expand sidebar"
      : "Collapse sidebar";
  const initials = (user?.fullName || "")
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <header
      /* Width follows the sidebar rail, which publishes --pmo-sidebar-width
         when it collapses. The fallback keeps this correct before the rail
         mounts; max-lg:w-full! opts mobile out, where the rail is an overlay. */
      style={{ width: "calc(100% - var(--pmo-sidebar-width, 19.44%))" }}
      className="pl-8 border-b-[1.5px] border-[#0000000D] p-4 flex items-center justify-between gap-2 bg-[#FFFFFF] fixed h-18 z-1000 max-lg:w-full! transition-[width] duration-300 ease-in-out"
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={handleSidebarToggle}
          aria-label={toggleLabel}
          aria-expanded={isDesktop ? !isSidebarCollapsed : isSidebarOpen}
          title={toggleLabel}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors hover:bg-[#0000000D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B3C4A]"
        >
          <CollapseIcon pointsRight={isDesktop && isSidebarCollapsed} />
        </button>

        <ul className="flex gap-2 overflow-x-auto no-scrollbar">
          <li className="shrink-0 h-10 flex items-center justify-between gap-2 rounded-md px-3 py-2 bg-[#0000000D]">
            <div className="flex items-center gap-2">
              <NotificationsIcon />
              <p className="hidden sm:block font-medium text-[14px]/[20px] text-[#636363] whitespace-nowrap">
                Notifications
              </p>
            </div>
            <p className="text-[#090909]">0</p>
          </li>
        </ul>
      </div>
      <div className="flex gap-3 shrink-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0000000D] font-medium text-[16px]/[24px] text-[#000000] shrink-0">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="font-medium text-[14px]/[20px] text-[#090909]">
            {user?.fullName}
          </p>
          <p className="font-normal text-[14px]/[20px] text-[#636363]">
            {user?.email}
          </p>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
