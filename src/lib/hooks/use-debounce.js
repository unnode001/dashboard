// src/lib/hooks/use-debounce.js
'use client';

import { useEffect, useState } from 'react';

export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // 设置一个定时器，在指定的 delay 后更新 debounced value
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 在下一次 effect 运行前或组件卸载时清除定时器
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // 仅在 value 或 delay 变化时重新设置 effect

    return debouncedValue;
}