import { FaBars } from 'react-icons/fa'

function NotificationsIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.52992 14.394C2.31727 15.7471 3.268 16.6862 4.43205 17.1542C8.89481 18.9486 15.1052 18.9486 19.5679 17.1542C20.732 16.6862 21.6827 15.7471 21.4701 14.394C21.3394 13.5625 20.6932 12.8701 20.2144 12.194C19.5873 11.2975 19.525 10.3197 19.5249 9.27941C19.5249 5.2591 16.1559 2 12 2C7.84413 2 4.47513 5.2591 4.47513 9.27941C4.47503 10.3197 4.41272 11.2975 3.78561 12.194C3.30684 12.8701 2.66061 13.5625 2.52992 14.394Z" fill="#228CEE" fillOpacity="0.3" stroke="#228CEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21C9.79613 21.6219 10.8475 22 12 22C13.1525 22 14.2039 21.6219 15 21" stroke="#228CEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/**
 * The app header, shared by MainSection and the Reports shell.
 *
 * Extracted so the two cannot drift: reports previously rendered with no header
 * at all, which made switching to that tab feel like leaving the application.
 */
function TopBar({ user, setIsSidebarOpen }) {
    const initials = (user?.fullName || "")
        .split(" ")
        .map(word => word[0])
        .join("")

    return (
        <header className='border-b-[1.5px] border-[#0000000D] p-4 flex items-center justify-between gap-2 bg-[#FFFFFF] fixed w-full lg:w-[80.55%] h-18 z-1000'>
            <div className='flex items-center gap-2 min-w-0'>
                <button
                    type='button'
                    aria-label='Open navigation'
                    onClick={() => setIsSidebarOpen(true)}
                    className='lg:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#0000000D] cursor-pointer'>
                    <FaBars className='text-lg text-[#1B3C4A]' />
                </button>
                <ul className='flex gap-2 overflow-x-auto no-scrollbar'>
                    <li className='shrink-0 h-10 flex items-center justify-between gap-2 rounded-md px-3 py-2 bg-[#0000000D]'>
                        <div className='flex items-center gap-2'>
                            <NotificationsIcon />
                            <p className='hidden sm:block font-medium text-[14px]/[20px] text-[#636363] whitespace-nowrap'>Notifications</p>
                        </div>
                        <p className='text-[#090909]'>0</p>
                    </li>
                </ul>
            </div>
            <div className='flex gap-3 shrink-0'>
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#0000000D] font-medium text-[16px]/[24px] text-[#000000] shrink-0'>{initials}</div>
                <div className='hidden sm:block'>
                    <p className='font-medium text-[14px]/[20px] text-[#090909]'>{user?.fullName}</p>
                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>{user?.email}</p>
                </div>
            </div>
        </header>
    )
}

export default TopBar
