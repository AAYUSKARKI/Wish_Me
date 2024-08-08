import { useEffect } from 'react';
import { IoMoon, IoSunny } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { settheme } from '../Redux/ThemeSlice';

function Theme() {
    const dispatch = useDispatch();
    const theme = useSelector((state: any) => state.theme.theme);

    // Apply the initial theme on component mount
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const darkModeHandler = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(settheme(newTheme));
    };

    return (
        <div className="z-10 absolute m-5 top-1/2 text-gray-950 right-0 transform -translate-y-1/2 dark:text-orange-500 flex items-center justify-center">
             <button className="p-2 cursor-pointer text-3xl" onClick={() => {
                darkModeHandler();
            }}>
                {theme === 'dark' ? <IoSunny /> : <IoMoon />}
            </button>
        </div>
    );
}

export default Theme;